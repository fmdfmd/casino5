'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Center, Loader } from '@mantine/core';
import { API_URL } from '@/shared/lib/api/axios';

export default function GamePlayPage() {
	const router = useRouter();
	const { id } = useParams();
	const [gameUrl, setGameUrl] = useState<string | null>(null);
	useEffect(() => {
		if (!id) return;

		axios
			.post(`${API_URL}/games/open`, {
				id,
				demo: false,
			})
			.then((res) => {
				console.log(res, 'res');
				setGameUrl(res.data.data.content.game.url);
			});
	}, [id]);

	if (!gameUrl) {
		return (
			<Center h='100vh'>
				<Loader />
			</Center>
		);
	}

	return (
		<iframe
			src={gameUrl}
			style={{
				width: '100vw',
				height: '100vh',
				border: 'none',
			}}
			allow='fullscreen'
		/>
	);
}
