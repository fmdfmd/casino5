'use client';
import { useState } from 'react';
import {
	Stack,
	Paper,
	Title,
	Text,
	Group,
	Button,
	Grid,
	Box,
	Flex,
	Progress,
	SimpleGrid,
	Divider,
} from '@mantine/core';
import {
	DeviceMobileIcon,
	GameControllerIcon,
	ChartLineUpIcon,
	CalendarIcon,
} from '@phosphor-icons/react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import dayjs from 'dayjs';
import styles from './Analytics.module.scss';

// --- ФУНКЦИЯ ФОРМАТИРОВАНИЯ ТЕКСТА ---
// Если название длиннее 12 символов, оно будет обрезано (например: "Pragmatic Play" -> "Pragmatic P...")
const formatLabel = (name: string) => {
	if (name.length > 12) return name.slice(0, 11) + '...';
	return name;
};

// --- ДАННЫЕ ---
const topProviders = [
	{ name: 'Pragmatic Play', users: 5093 },
	{ name: 'Push Gaming', users: 4093 },
	{ name: 'Evolution', users: 3093 },
	{ name: 'Hacksaw Gaming', users: 5093 },
	{ name: 'Nolimit City', users: 4093 },
	{ name: 'PlaynGO', users: 6093 },
	{ name: 'NetEnt', users: 7093 },
];

const topGames = [
	{ name: 'Gates of Olympus', users: 7093 },
	{ name: 'Sugar Rush 1000', users: 6093 },
	{ name: 'Sweet Bonanza', users: 5093 },
	{ name: 'The Dog House', users: 4800 },
	{ name: 'Wanted Dead or A Wild', users: 4200 },
	{ name: 'Big Bass Splash', users: 3900 },
	{ name: 'Legacy of Dead', users: 3500 },
	{ name: 'Mental', users: 3100 },
	{ name: 'Zeus vs Hades', users: 2900 },
	{ name: 'Book of Ra', users: 2500 },
];

// КАСТОМНЫЙ ТУЛТИП (ПЛАШКА ПРИ НАВЕДЕНИИ)
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<Box className={styles.chartTooltip}>
				<Text fz='10px' c='dimmed' fw={700} mb={4} tt='uppercase'>
					{label}
				</Text>
				<Group gap={8}>
					<div
						className={styles.tooltipDot}
						style={{ backgroundColor: payload[0].fill || '#0066FF' }}
					/>
					<Text fz='xs' fw={800} c='white' ff='monospace'>
						{payload[0].value.toLocaleString()} USERS
					</Text>
				</Group>
			</Box>
		);
	}
	return null;
};

export default function AnalyticsPage() {
	const [activePeriod, setActivePeriod] = useState('Month');

	return (
		<Box className={styles.pageWrapper}>
			{/* ГЛОБАЛЬНЫЙ ФИКС ЦВЕТОВ И ЧЕТКОСТИ ТЕКСТА */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
                .recharts-bar-rectangle path { fill: inherit !important; stroke: none !important; }
                
                /* Делаем шрифт четким в SVG */
                .recharts-text tspan { 
                    text-rendering: optimizeLegibility; 
                    -webkit-font-smoothing: antialiased;
                }

                /* Фикс цветов столбцов по ID контейнеров */
                #chart-providers .recharts-bar-rectangle:nth-child(odd) path { fill: #0066FF !important; }
                #chart-providers .recharts-bar-rectangle:nth-child(even) path { fill: #00A3FF !important; }
                
                #chart-games .recharts-bar-rectangle:nth-child(odd) path { fill: #FFFFFF !important; }
                #chart-games .recharts-bar-rectangle:nth-child(even) path { fill: #00A3FF !important; }
                
                .recharts-cartesian-grid-line { stroke: rgba(255,255,255,0.03) !important; }
                .recharts-surface { outline: none !important; }
            `,
				}}
			/>

			<Stack gap='xl' p={{ base: 'md', lg: 35 }} maw={1600} mx='auto'>
				{/* ПАНЕЛЬ ФИЛЬТРОВ */}
				<Paper className={styles.filterBar} p='md' radius='md'>
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align={{ base: 'stretch', sm: 'center' }}
						gap='md'
					>
						<Group gap='xs'>
							<CalendarIcon size={24} color='#3b82f6' weight='duotone' />
							<Title order={1} c='white' fz={{ base: 22, sm: 26 }} fw={800}>
								Analytics
							</Title>
						</Group>

						<Group gap={0} className={styles.segmentedControl}>
							{['Day', 'Month', 'Year'].map((p) => (
								<button
									key={p}
									onClick={() => setActivePeriod(p)}
									className={
										activePeriod === p ? styles.segBtnActive : styles.segBtn
									}
								>
									{p}
								</button>
							))}
						</Group>
					</Flex>
				</Paper>

				{/* PROVIDERS ACTIVITY */}
				<Paper className={styles.chartCard} p={{ base: 'md', sm: 'lg' }}>
					<Group gap='xs' mb='xl'>
						<GameControllerIcon size={20} weight='fill' color='#3b82f6' />
						<Text fw={800} c='white' fz='sm' tt='uppercase'>
							Providers Statistics
						</Text>
					</Group>
					<Box h={{ base: 300, sm: 350 }} id='chart-providers'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={topProviders} margin={{ bottom: 60 }}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey='name'
									axisLine={false}
									tickLine={false}
									interval={0}
									height={80}
									/* ПРИМЕНЯЕМ ФУНКЦИЮ ТУТ */
									tickFormatter={formatLabel}
									tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
									angle={-45}
									textAnchor='end'
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: '#64748b', fontSize: 10 }}
									width={35}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='users' radius={[4, 4, 0, 0]} activeBar={false} />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				</Paper>

				{/* TOP 10 GAMES */}
				<Paper className={styles.chartCard} p={{ base: 'md', sm: 'lg' }}>
					<Group gap='xs' mb='xl'>
						<ChartLineUpIcon size={20} weight='fill' color='#00A3FF' />
						<Text fw={800} c='white' fz='sm' tt='uppercase'>
							Top 10 Active Games
						</Text>
					</Group>
					<Box h={{ base: 350, sm: 400 }} id='chart-games'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={topGames} margin={{ bottom: 70 }}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey='name'
									axisLine={false}
									tickLine={false}
									interval={0}
									height={90}
									/* ПРИМЕНЯЕМ ФУНКЦИЮ ТУТ */
									tickFormatter={formatLabel}
									tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
									angle={-45}
									textAnchor='end'
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: '#64748b', fontSize: 10 }}
									width={35}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='users' radius={[2, 2, 0, 0]} activeBar={false} />
							</BarChart>
						</ResponsiveContainer>
					</Box>
				</Paper>

				{/* DEVICE STATISTICS */}
				<Paper className={styles.chartCard} p={{ base: 'md', sm: 'lg' }}>
					<Group gap='xs' mb='xl'>
						<DeviceMobileIcon size={20} weight='fill' color='#3b82f6' />
						<Text fw={800} c='white' fz='sm' tt='uppercase'>
							Device usage
						</Text>
					</Group>
					<SimpleGrid
						cols={{ base: 1, sm: 3 }}
						spacing='0'
						className={styles.deviceGrid}
					>
						<Box className={styles.deviceBox}>
							<Text fz='xs' fw={700} c='dimmed'>
								Desktop
							</Text>
							<Text fz='sm' fw={900} c='white'>
								50%
							</Text>
						</Box>
						<Box
							className={styles.deviceBox}
							style={{
								borderLeft: '1px solid rgba(255,255,255,0.05)',
								borderRight: '1px solid rgba(255,255,255,0.05)',
							}}
						>
							<Text fz='xs' fw={700} c='dimmed'>
								Tablet
							</Text>
							<Text fz='sm' fw={900} c='white'>
								30%
							</Text>
						</Box>
						<Box className={styles.deviceBox}>
							<Text fz='xs' fw={700} c='dimmed'>
								Mobile
							</Text>
							<Text fz='sm' fw={900} c='white'>
								20%
							</Text>
						</Box>
					</SimpleGrid>
					<Progress.Root
						size='xl'
						mt='md'
						radius='sm'
						bg='rgba(255,255,255,0.05)'
					>
						<Progress.Section value={50} color='blue.6' />
						<Progress.Section value={30} color='blue.4' />
						<Progress.Section value={20} color='cyan.4' />
					</Progress.Root>
				</Paper>
			</Stack>
		</Box>
	);
}
