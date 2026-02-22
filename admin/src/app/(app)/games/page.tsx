'use client';

import { useEffect, useState } from 'react';
import {
	Container,
	Title,
	Tabs,
	Table,
	Badge,
	Button,
	Group,
	Switch,
	ActionIcon,
	Modal,
	TextInput,
	MultiSelect,
	NumberInput,
	Paper,
	Text,
} from '@mantine/core';
import { AreaChart } from '@mantine/charts'; // Графики
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
	IconEdit,
	IconDeviceGamepad2,
	IconChartLine,
} from '@tabler/icons-react';
import { api } from '@/shared/lib/api/axios';

export default function AdminGamesManagement() {
	const [activeTab, setActiveTab] = useState<string | null>('list');
	const [games, setGames] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [chartData, setChartData] = useState<any[]>([]);

	// Модалка радактирования
	const [opened, { open, close }] = useDisclosure(false);
	const [editingGame, setEditingGame] = useState<any>(null);
	const [selectedCats, setSelectedCats] = useState<string[]>([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [gamesRes, catsRes, chartRes] = await Promise.all([
				api.get('/admin/games'),
				api.get('/admin/games/categories'),
				api.get('/admin/games/analytics'), // Данные для AreaChart
			]);
			setGames(gamesRes.data);
			setCategories(catsRes.data);

			// Форматируем данные для графика Mantine Charts
			const formattedChart = chartRes.data.map((d) => ({
				date: d.date,
				Launches: Number(d.totalLaunches),
				Bets: Number(d.totalRealBets),
			}));
			setChartData(formattedChart);
		} catch (e) {
			notifications.show({
				title: 'Error',
				message: 'Failed to load games data',
				color: 'red',
			});
		}
	};

	const handleEditClick = (game: any) => {
		setEditingGame(game);
		// Извлекаем ID категорий из связанной таблицы (зависит от вашей структуры relations в Drizzle)
		const currentCatIds =
			game.categories?.map((c: any) => c.gamesCategoriesId) || [];
		setSelectedCats(currentCatIds);
		open();
	};

	const handleSaveSettings = async () => {
		try {
			// 1. Сохраняем лимиты и House Edge
			await api.patch(`/admin/games/${editingGame.id}`, {
				name: editingGame.name,
				isActive: editingGame.isActive,
				houseEdge: editingGame.houseEdge,
				rtp: editingGame.rtp,
				minBetUsd: editingGame.minBetUsd,
				maxBetUsd: editingGame.maxBetUsd,
			});

			// 2. Сохраняем категории
			await api.put(`/admin/games/${editingGame.id}/categories`, {
				categoryIds: selectedCats,
			});

			notifications.show({
				title: 'Success',
				message: 'Game settings updated',
				color: 'green',
			});
			close();
			fetchData(); // Перезагружаем список
		} catch (e) {
			notifications.show({
				title: 'Error',
				message: 'Update failed',
				color: 'red',
			});
		}
	};

	const handleToggleActive = async (id: string, current: boolean) => {
		try {
			await api.patch(`/admin/games/${id}`, { isActive: !current });
			setGames((prev) =>
				prev.map((g) => (g.id === id ? { ...g, isActive: !current } : g)),
			);
		} catch (e) {}
	};

	return (
		<Container fluid p='md'>
			<Title order={2} mb='lg'>
				Game Hub (Stake System)
			</Title>

			<Tabs value={activeTab} onChange={setActiveTab} variant='outline' mb='md'>
				<Tabs.List>
					<Tabs.Tab value='list' leftSection={<IconDeviceGamepad2 size={16} />}>
						Games Inventory
					</Tabs.Tab>
					<Tabs.Tab value='analytics' leftSection={<IconChartLine size={16} />}>
						Global Analytics
					</Tabs.Tab>
				</Tabs.List>

				{/* --- ВКЛАДКА СПИСКА ИГР --- */}
				<Tabs.Panel value='list' pt='md'>
					<Paper withBorder p='0' radius='md'>
						<Table striped highlightOnHover verticalSpacing='sm'>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Game</Table.Th>
									<Table.Th>Provider</Table.Th>
									<Table.Th>House Edge / RTP</Table.Th>
									<Table.Th>Popularity</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Config</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{games.map((game) => (
									<Table.Tr key={game.id}>
										<Table.Td fw={600}>{game.name}</Table.Td>
										<Table.Td>
											<Badge variant='light' color='gray'>
												{game.provider}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Text size='sm' c='blue'>
												{game.houseEdge}%
											</Text>
											<Text size='xs' c='dimmed'>
												{game.rtp}% RTP
											</Text>
										</Table.Td>
										<Table.Td>
											<Badge color='grape' variant='dot'>
												Score: {game.popularity?.popularityScore || 0}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Switch
												checked={game.isActive}
												onChange={() =>
													handleToggleActive(game.id, game.isActive)
												}
												color='teal'
											/>
										</Table.Td>
										<Table.Td>
											<ActionIcon
												variant='light'
												color='blue'
												onClick={() => handleEditClick(game)}
											>
												<IconEdit size={18} />
											</ActionIcon>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Paper>
				</Tabs.Panel>

				{/* --- ВКЛАДКА АНАЛИТИКИ (Графики) --- */}
				<Tabs.Panel value='analytics' pt='md'>
					<Paper withBorder p='xl' radius='md'>
						<Title order={4} mb='md'>
							Game Launches & Bets (Last 30 Days)
						</Title>
						<Text c='dimmed' mb='xl'>
							Aggregated data from games_stats_daily table.
						</Text>

						{/* График Mantine */}
						{chartData.length > 0 ? (
							<AreaChart
								h={300}
								data={chartData}
								dataKey='date'
								series={[
									{ name: 'Launches', color: 'indigo.6' },
									{ name: 'Bets', color: 'teal.6' },
								]}
								curveType='monotone'
								withLegend
								tooltipAnimationDuration={200}
							/>
						) : (
							<Text c='dimmed'>No data available yet.</Text>
						)}
					</Paper>
				</Tabs.Panel>
			</Tabs>

			{/* --- МОДАЛКА РЕДАКТИРОВАНИЯ ИГРЫ --- */}
			<Modal
				opened={opened}
				onClose={close}
				title='Configure Game Properties'
				size='lg'
			>
				{editingGame && (
					<div className='flex flex-col gap-4'>
						<TextInput
							label='Game Name'
							value={editingGame.name}
							onChange={(e) =>
								setEditingGame({ ...editingGame, name: e.target.value })
							}
						/>

						<Group grow>
							<NumberInput
								label='House Edge (%)'
								description='Casino profit margin (Stake is usually 1-4%)'
								value={Number(editingGame.houseEdge)}
								onChange={(v) =>
									setEditingGame({ ...editingGame, houseEdge: v })
								}
								decimalScale={2}
							/>
							<NumberInput
								label='RTP (%)'
								description='Return to Player'
								value={Number(editingGame.rtp)}
								onChange={(v) => setEditingGame({ ...editingGame, rtp: v })}
								decimalScale={2}
							/>
						</Group>

						<Group grow>
							<NumberInput
								label='Min Bet (USD)'
								value={Number(editingGame.minBetUsd)}
								onChange={(v) =>
									setEditingGame({ ...editingGame, minBetUsd: v })
								}
							/>
							<NumberInput
								label='Max Bet (USD)'
								value={Number(editingGame.maxBetUsd)}
								onChange={(v) =>
									setEditingGame({ ...editingGame, maxBetUsd: v })
								}
							/>
						</Group>

						{/* Выбор категорий (Связь Many-to-Many) */}
						<MultiSelect
							label='Game Categories'
							description='Assign this game to Lobby categories'
							data={categories.map((c) => ({ value: c.id, label: c.name }))}
							value={selectedCats}
							onChange={setSelectedCats}
							searchable
							clearable
						/>

						<Button fullWidth color='blue' mt='md' onClick={handleSaveSettings}>
							Save Configuration
						</Button>
					</div>
				)}
			</Modal>
		</Container>
	);
}
