'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Image, SimpleGrid, Text, Loader, Center } from '@mantine/core';
import { useRouter } from 'next/navigation';

type Game = {
	id: string;
	name: string;
	img: string;
	title: string;
	categories: string;
};

export default function GamesLobbyPage() {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		axios.get('http://localhost:8000/games/list').then((res) => {
			const raw = res.data.data;
			console.log(raw, 'raw');
			const flat: Game[] = Object.values(raw).flat();
			setGames(flat);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<Center h='100vh'>
				<Loader />
			</Center>
		);
	}

	return (
		<SimpleGrid cols={5} spacing='md' p='md'>
			{games.map((game) => (
				<Card
					key={game.id}
					shadow='sm'
					radius='md'
					withBorder
					style={{ cursor: 'pointer' }}
					onClick={() => {
						router.push(`/games/${game.id}`);
					}}
				>
					<Card.Section>
						<Image src={game.img} height={140} />
					</Card.Section>
					<Text fw={500} mt='sm' size='sm'>
						{game.name}
					</Text>
					<Text size='xs' c='dimmed'>
						{game.title}
					</Text>
				</Card>
			))}
		</SimpleGrid>
	);
}
