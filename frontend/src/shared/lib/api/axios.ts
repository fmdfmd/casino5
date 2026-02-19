import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from './api-response';

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	<T>(response: AxiosResponse<ApiResponse<T>>): T => {
		const body = response.data;

		if (!body.success) {
			throw body.error;
		}

		return body as T;
	},
	async (error) => {
		const originalRequest = error.config;

		// Если ошибки нет или статус не 401, просто отклоняем
		if (!error.response || error.response.status !== 401) {
			return Promise.reject(error);
		}

		// ЗАЩИТА ОТ ПЕТЛИ: Если запрос на refresh сам вернул 401 — это конец сессии.
		// Важно: originalRequest.url может быть полным или относительным, проверяем надежно.
		if (originalRequest.url.includes('/auth/refresh')) {
			// Если мы уже на логине, не надо редиректить снова, просто реджектим
			if (
				typeof window !== 'undefined' &&
				!window.location.pathname.includes('/')
			) {
				window.location.href = '/';
			}
			return Promise.reject(error);
		}

		// Если запрос уже ретраился, но снова 401 — значит токен не помог
		if (originalRequest._retry) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then(() => {
					return api(originalRequest);
				})
				.catch((err) => {
					return Promise.reject(err);
				});
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			// Выполняем refresh.
			// ВАЖНО: Убедитесь, что этот axios запрос НЕ проходит через этот же интерсептор.
			// Так как вы используете axios.get (глобальный) а интерсептор на api (инстанс), это безопасно.
			await axios.get(`${API_URL}/auth/refresh`, {
				withCredentials: true,
			});

			// Если успешно — очередь получает сигнал продолжить
			processQueue(null);

			// Повторяем оригинальный запрос
			return api(originalRequest);
		} catch (refreshError) {
			// Если refresh упал — убиваем все запросы в очереди
			processQueue(refreshError);

			if (
				typeof window !== 'undefined' &&
				!window.location.pathname.includes('/')
			) {
				window.location.href = '/';
			}
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);
