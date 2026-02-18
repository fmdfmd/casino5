'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../lib/api/axios';

let socket: Socket | null = null;
let isRefreshing = false;

export async function refreshSession() {
	await api.get('/auth/refresh', { withCredentials: true });
}

export const useSocket = (path?: string) => {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!socket) {
			socket = io('http://localhost:8000', {
				transports: ['websocket'],
				withCredentials: true,
				autoConnect: false,
				path: path ? path : undefined,
			});
		}

		const connectSocket = async () => {
			try {
				await api.get('/auth/me'); // проверка access
				socket!.connect();
			} catch {
				// await refreshSession();
				socket!.connect();
			}
		};

		socket.on('connect', () => setIsConnected(true));
		socket.on('disconnect', () => setIsConnected(false));

		socket.on('auth:refresh_required', async () => {
			if (isRefreshing) return;
			isRefreshing = true;

			try {
				await refreshSession();
				socket?.disconnect();
				socket?.connect();
			} catch (err) {
				console.log(err);
				console.log('Refresh failed, continue as guest');
			} finally {
				isRefreshing = false;
			}
		});

		connectSocket();

		return () => {
			socket?.off('connect');
			socket?.off('disconnect');
			socket?.off('auth:expired');
		};
	}, []);

	return { socket, isConnected };
};
