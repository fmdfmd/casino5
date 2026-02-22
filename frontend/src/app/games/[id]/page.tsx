'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { api } from '@/shared/lib/api/axios';

export default function GamePlayPage() {
	const { id } = useParams();
	const [gameUrl, setGameUrl] = useState<string | null>(null);
	useEffect(() => {
		if (!id) return;

		api
			.post('/games/open', {
				id,
				demo: false,
			})
			.then((res) => {
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
