import { BACKEND_URL } from '@/shared/hooks/useSocket';

export type ApiConfig = {
	baseURL: string;
	timeout: number;
	headers: Record<string, string>;
};

export type ApiResponse<T = any> = {
	data: T;
	status: number;
};

export type ApiErrorPayload = {
	message?: string;
	status?: number;
	errors?: Array<{ code: string; message: string }>;
	[k: string]: any;
};

// Back-compat alias (some old code may import ApiError)
export type ApiError = ApiErrorPayload;

export type UploadProgress = {
	loaded: number;
	total: number;
	percentage: number;
};

export class ApiHttpError extends Error {
	status: number;
	payload?: ApiErrorPayload;
	url?: string;
	method?: string;

	constructor(
		message: string,
		status: number,
		payload?: ApiErrorPayload,
		url?: string,
		method?: string,
	) {
		super(message);
		this.name = 'ApiHttpError';
		this.status = status;
		this.payload = payload;
		this.url = url;
		this.method = method;
	}
}

class BaseApiService {
	private config: ApiConfig;

	constructor() {
		this.config = {
			baseURL: (BACKEND_URL || 'http://localhost:8000')
				.toString()
				.replace(/\/$/, ''),
			timeout: 15000,
			headers: {
				'Content-Type': 'application/json',
			},
		};
	}

	/** Read the access token from storage (supports multiple keys) */
	private getAuthToken(): string | null {
		if (typeof window === 'undefined') return null;
		return (
			localStorage.getItem('token') ||
			localStorage.getItem('access_token') ||
			localStorage.getItem('adminAccessToken')
		);
	}

	/** Merge default headers with custom ones and attach Authorization if present */
	private createHeaders(
		custom?: Record<string, string>,
	): Record<string, string> {
		const headers = { ...this.config.headers, ...(custom || {}) };
		const token = this.getAuthToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
		return headers;
	}

	/** Core fetch request wrapper that throws ApiHttpError on non-2xx */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<ApiResponse<T>> {
		const url = `${this.config.baseURL}${endpoint}`;
		const headers = this.createHeaders(
			options.headers as Record<string, string>,
		);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

		try {
			const res = await fetch(url, {
				...options,
				headers,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			const contentType = (res.headers.get('content-type') || '').toLowerCase();
			const isJson = contentType.includes('application/json');

			let parsedBody: any = undefined;
			if (isJson) {
				try {
					parsedBody = await res.json();
				} catch {
					parsedBody = undefined;
				}
			} else {
				// Non-JSON responses are allowed; leave data undefined or raw text if needed
				try {
					const text = await res.text();
					parsedBody = text || undefined;
				} catch {
					parsedBody = undefined;
				}
			}

			if (!res.ok) {
				if (typeof window !== 'undefined' && res.status === 401) {
					try {
						localStorage.removeItem('token');
						localStorage.removeItem('access_token');
						localStorage.removeItem('adminAccessToken');
					} catch {}
				}
				const message =
					(parsedBody && (parsedBody.message || parsedBody.error)) ||
					`HTTP ${res.status}`;
				throw new ApiHttpError(
					message,
					res.status,
					parsedBody,
					url,
					options.method || 'GET',
				);
			}

			return {
				data: (parsedBody as T) ?? (undefined as any),
				status: res.status,
			};
		} catch (e: any) {
			clearTimeout(timeoutId);
			if (e?.name === 'AbortError') {
				throw new ApiHttpError(
					'Request timeout',
					408,
					undefined,
					url,
					options.method || 'GET',
				);
			}
			if (e instanceof ApiHttpError) throw e;
			throw new ApiHttpError(
				e?.message || 'Network error',
				0,
				undefined,
				url,
				options.method || 'GET',
			);
		}
	}

	/** GET with query params */
	async get<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean>,
	): Promise<ApiResponse<T>> {
		const url = new URL(`${this.config.baseURL}${endpoint}`);
		if (params) {
			Object.entries(params).forEach(([k, v]) => {
				if (v !== undefined && v !== null)
					url.searchParams.append(k, String(v));
			});
		}
		// pass only pathname+search to request()
		return this.request<T>(url.pathname + url.search);
	}

	/** POST JSON */
	async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: data !== undefined ? JSON.stringify(data) : undefined,
		});
	}

	/** PUT JSON */
	async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: data !== undefined ? JSON.stringify(data) : undefined,
		});
	}

	/** PATCH JSON */
	async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'PATCH',
			body: data !== undefined ? JSON.stringify(data) : undefined,
		});
	}

	/** DELETE */
	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}

	/** ---------------- File upload with progress (XHR) ----------------
	 * Overload 1 (legacy): upload(endpoint, file, onProgress?)
	 * Overload 2 (explicit): upload(endpoint, file, fieldName, onProgress?, extraFormFields?)
	 */

	// Overload: legacy signature (3rd arg is onProgress)
	async upload<T>(
		endpoint: string,
		file: File | Blob,
		onProgress?: (progress: UploadProgress) => void,
	): Promise<ApiResponse<T>>;

	// Overload: explicit field name + optional extra fields
	async upload<T>(
		endpoint: string,
		file: File | Blob,
		fieldName: string,
		onProgress?: (progress: UploadProgress) => void,
		extraFormFields?: Record<string, string | number | boolean>,
	): Promise<ApiResponse<T>>;

	// Implementation
	async upload<T>(
		endpoint: string,
		file: File | Blob,
		fieldNameOrCb?: string | ((progress: UploadProgress) => void),
		onProgressMaybe?: (progress: UploadProgress) => void,
		extraFormFields?: Record<string, string | number | boolean>,
	): Promise<ApiResponse<T>> {
		const fieldName =
			typeof fieldNameOrCb === 'string' ? fieldNameOrCb : 'file';
		const onProgress =
			typeof fieldNameOrCb === 'function' ? fieldNameOrCb : onProgressMaybe;

		const form = new FormData();
		form.append(fieldName, file);
		if (extraFormFields) {
			Object.entries(extraFormFields).forEach(([k, v]) =>
				form.append(k, String(v)),
			);
		}

		const headers = this.createHeaders();
		delete headers['Content-Type']; // let browser set multipart/form-data boundary

		const url = `${this.config.baseURL}${endpoint}`;

		return new Promise<ApiResponse<T>>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (evt) => {
				if (!onProgress || !evt.lengthComputable) return;
				onProgress({
					loaded: evt.loaded,
					total: evt.total,
					percentage: (evt.loaded / evt.total) * 100,
				});
			});

			xhr.addEventListener('load', () => {
				const status = xhr.status;
				const ct = (xhr.getResponseHeader('content-type') || '').toLowerCase();

				let parsed: any = undefined;
				if (ct.includes('application/json')) {
					try {
						parsed = JSON.parse(xhr.responseText || 'null');
					} catch {
						parsed = undefined;
					}
				} else {
					parsed = xhr.responseText || undefined;
				}

				if (status >= 200 && status < 300) {
					resolve({ data: parsed as T, status });
					return;
				}

				if (status === 401 && typeof window !== 'undefined') {
					try {
						localStorage.removeItem('token');
						localStorage.removeItem('access_token');
						localStorage.removeItem('adminAccessToken');
					} catch {}
				}

				const msg =
					(parsed &&
						(parsed.message || (typeof parsed === 'string' ? parsed : ''))) ||
					`HTTP ${status}`;
				reject(new ApiHttpError(msg, status, parsed, url, 'POST'));
			});

			xhr.addEventListener('error', () => {
				reject(new ApiHttpError('Network error', 0, undefined, url, 'POST'));
			});

			xhr.open('POST', url);
			Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
			xhr.send(form);
		});
	}

	/** Runtime configuration */
	setBaseURL(baseURL: string): void {
		this.config.baseURL = baseURL.replace(/\/$/, '');
	}
	setTimeout(timeout: number): void {
		this.config.timeout = timeout;
	}
	setDefaultHeaders(headers: Record<string, string>): void {
		this.config.headers = { ...this.config.headers, ...headers };
	}
}

export const baseApi = new BaseApiService();
