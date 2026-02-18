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
	Badge,
	Divider,
	Popover,
	Progress,
	Avatar,
	ScrollArea,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { CalendarBlankIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import styles from '../Dashboards.module.scss';

import '@mantine/dates/styles.css';

const chartData = [
	{ name: '1', deposits: 4200, users: 3100 },
	{ name: '5', deposits: 5500, users: 4200 },
	{ name: '10', deposits: 9200, users: 8400 },
	{ name: '15', deposits: 7000, users: 6100 },
	{ name: '20', deposits: 11500, users: 5200 },
	{ name: '25', deposits: 8500, users: 7300 },
	{ name: '30', deposits: 14000, users: 9500 },
];

const regionData = [
	{ country: 'Brazil', code: 'br', val: 5000, percent: 90 },
	{ country: 'Germany', code: 'de', val: 4200, percent: 85 },
	{ country: 'Poland', code: 'pl', val: 3800, percent: 80 },
	{ country: 'France', code: 'fr', val: 2900, percent: 75 },
	{ country: 'Spain', code: 'es', val: 2100, percent: 70 },
	{ country: 'Italy', code: 'it', val: 1800, percent: 65 },
];

const CustomChartTooltip = ({ active, payload, label, color }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className={styles.customTooltipContainer}>
				<Text fz='10px' c='dimmed' fw={700} mb={4} tt='uppercase'>
					Day {label}
				</Text>
				<Group gap={8}>
					<div
						className={styles.tooltipDot}
						style={{ backgroundColor: color }}
					/>
					<Text fz='xs' fw={900} c='white' ff='monospace'>
						{payload[0].name.toUpperCase()}: {payload[0].value.toLocaleString()}
					</Text>
				</Group>
			</div>
		);
	}
	return null;
};

export default function DashboardPage() {
	const [activeFilter, setActiveFilter] = useState('Month');
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		null,
		null,
	]);
	const [opened, setOpened] = useState(false);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return (
		<Box className={styles.pageWrapper}>
			<style
				dangerouslySetInnerHTML={{
					__html: `
                .recharts-curve { fill: none !important; stroke-width: 3px !important; }
                .recharts-area-area { stroke: none !important; }
                .recharts-cartesian-grid-line { stroke: rgba(255,255,255,0.03) !important; }
                .recharts-surface { outline: none; }
                .recharts-text { fill: #475569 !important; font-size: 10px; }
            `,
				}}
			/>

			<Stack
				gap={{ base: 20, md: 40 }}
				p={{ base: 'md', sm: 'xl', lg: 50 }}
				maw={1800}
				mx='auto'
			>
				{/* ОБНОВЛЕННЫЙ АДАПТИВНЫЙ ФИЛЬТР */}
				<Paper
					className={styles.filterSection}
					p={{ base: 'md', sm: 'lg' }}
					radius='lg'
				>
					<Flex direction='column' gap='md'>
						{/* Заголовок и дата */}
						<Flex
							justify='space-between'
							align={{ base: 'flex-start', sm: 'center' }}
							direction={{ base: 'column', sm: 'row' }}
							gap='xs'
						>
							<Group gap={15}>
								<Title order={3} c='white' fz={{ base: 20, sm: 24 }} fw={700}>
									Agent Status
								</Title>
								<Divider
									orientation='vertical'
									h={20}
									visibleFrom='sm'
									opacity={0.2}
								/>
							</Group>
							<Text c='dimmed' fz='xs' ff='monospace'>
								{dayjs().format('DD.MM.YYYY / HH:mm')}
							</Text>
						</Flex>

						{/* Кнопки */}
						<Flex
							direction={{ base: 'column', lg: 'row' }}
							gap='md'
							align={{ lg: 'center' }}
						>
							<Box className={styles.segmentedWrapper}>
								<div className={styles.segmentedControl}>
									{['Day', 'Week', 'Month'].map((f) => (
										<button
											key={f}
											onClick={() => setActiveFilter(f)}
											className={
												activeFilter === f ? styles.segBtnActive : styles.segBtn
											}
										>
											{f}
										</button>
									))}
								</div>
							</Box>

							<Flex direction={{ base: 'column', sm: 'row' }} gap='sm' flex={1}>
								<Popover
									opened={opened}
									onChange={setOpened}
									position='bottom-end'
									radius='lg'
									shadow='xl'
									offset={15}
								>
									<Popover.Target>
										<Button
											leftSection={<CalendarBlankIcon size={18} />}
											onClick={() => setOpened((o) => !o)}
											variant={activeFilter === 'Custom' ? 'filled' : 'light'}
											color={activeFilter === 'Custom' ? 'blue' : 'gray'}
											radius='md'
											size='md'
											fullWidth
											className={styles.customRangeBtn}
										>
											Custom Range
										</Button>
									</Popover.Target>
									<Popover.Dropdown p={0} className={styles.calendarDropdown}>
										<Flex direction={{ base: 'column', sm: 'row' }}>
											<Box p='md'>
												<DatePicker
													type='range'
													value={dateRange}
													onChange={setDateRange}
													className={styles.customDatePicker}
												/>
												<Group grow mt='md' gap='sm'>
													<Button
														color='blue'
														radius='md'
														onClick={() => setOpened(false)}
													>
														Apply
													</Button>
													{/* КНОПКА CLEAR: Ярко-красная */}
													<Button
														variant='filled'
														color='red'
														radius='md'
														onClick={() => setDateRange([null, null])}
													>
														Clear
													</Button>
												</Group>
											</Box>
											<Box
												w={{ base: '100%', sm: 150 }}
												bg='#f8fafc'
												style={{ borderLeft: '1px solid #eee' }}
											>
												<ScrollArea h={{ base: 150, sm: 400 }} p='xs'>
													<Stack gap={4}>
														<Text
															fz='10px'
															fw={800}
															c='dimmed'
															tt='uppercase'
															p='xs'
														>
															Months
														</Text>
														{months.map((m) => (
															<Button
																key={m}
																variant='subtle'
																color='gray'
																size='sm'
																radius='md'
																justify='start'
															>
																{m}
															</Button>
														))}
													</Stack>
												</ScrollArea>
											</Box>
										</Flex>
									</Popover.Dropdown>
								</Popover>

								<Button
									variant='filled'
									color='red.8'
									radius='md'
									size='md'
									fullWidth
									className={styles.resetBtn}
									leftSection={<ArrowsClockwiseIcon size={18} />}
								>
									Reset
								</Button>
							</Flex>
						</Flex>
					</Flex>
				</Paper>

				{/* ГРАФИКИ (ОТКАЧЕНО К ВАШЕМУ ВАРИАНТУ) */}
				<Grid gutter='xl'>
					<Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
						<Paper className={styles.mainCard} p='xl'>
							<Text c='white' fz='xs' fw={800} tt='uppercase' lts='1px' mb='lg'>
								Deposit Analysis
							</Text>
							<Box h={250}>
								<ResponsiveContainer width='100%' height='100%'>
									<AreaChart data={chartData}>
										<defs>
											<linearGradient
												id='colorCyan'
												x1='0'
												y1='0'
												x2='0'
												y2='1'
											>
												<stop
													offset='5%'
													stopColor='#00A3FF'
													stopOpacity={0.4}
												/>
												<stop
													offset='95%'
													stopColor='#00A3FF'
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray='3 3' vertical={false} />
										<XAxis dataKey='name' hide />
										<YAxis axisLine={false} tickLine={false} width={30} />
										<Tooltip content={<CustomChartTooltip color='#00A3FF' />} />
										<Area
											type='monotone'
											name='Deposits'
											dataKey='deposits'
											stroke='#00A3FF'
											fill='url(#colorCyan)'
										/>
									</AreaChart>
								</ResponsiveContainer>
							</Box>
							<Group mt='xl' gap={4} justify='center'>
								{['Crypto', 'Fiat', 'Usdt', 'USD', 'ETH'].map((l) => (
									<Badge
										key={l}
										size='xs'
										variant='outline'
										color='blue'
										px={6}
									>
										{l}
									</Badge>
								))}
							</Group>
						</Paper>
					</Grid.Col>

					<Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
						<Paper className={styles.mainCard} p='xl'>
							<Text c='white' fz='xs' fw={800} tt='uppercase' lts='1px' mb='lg'>
								Active Users
							</Text>
							<Box h={250}>
								<ResponsiveContainer width='100%' height='100%'>
									<AreaChart data={chartData}>
										<defs>
											<linearGradient
												id='colorRose'
												x1='0'
												y1='0'
												x2='0'
												y2='1'
											>
												<stop
													offset='5%'
													stopColor='#FB7185'
													stopOpacity={0.4}
												/>
												<stop
													offset='95%'
													stopColor='#FB7185'
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray='3 3' vertical={false} />
										<XAxis dataKey='name' hide />
										<YAxis axisLine={false} tickLine={false} width={30} />
										<Tooltip content={<CustomChartTooltip color='#FB7185' />} />
										<Area
											type='monotone'
											name='Players'
											dataKey='users'
											stroke='#FB7185'
											fill='url(#colorRose)'
										/>
									</AreaChart>
								</ResponsiveContainer>
							</Box>
							<Text ta='center' fz='xs' c='dimmed' mt='xl' fw={700}>
								GLOBAL PLAYER BASE
							</Text>
						</Paper>
					</Grid.Col>

					<Grid.Col span={{ base: 12, lg: 4 }}>
						<Paper className={styles.mainCard} p='xl'>
							<Text c='white' fz='xs' fw={800} tt='uppercase' lts='1px' mb='lg'>
								Regional Performance
							</Text>
							<Stack gap={12} h={250} justify='center'>
								{regionData.map((r, i) => (
									<Group key={i} wrap='nowrap' gap='sm'>
										<Avatar
											src={`https://flagcdn.com/w40/${r.code}.png`}
											size={18}
											radius='xs'
										/>
										<Progress
											value={r.percent}
											color='green.6'
											size='xs'
											flex={1}
											radius='xl'
										/>
										<Text
											fz={12}
											c='white'
											ff='monospace'
											fw={700}
											w={45}
											ta='right'
										>
											{r.val}
										</Text>
									</Group>
								))}
							</Stack>
							<Text ta='center' fz='xs' c='dimmed' mt='xl' fw={700}>
								TOP LOCATIONS
							</Text>
						</Paper>
					</Grid.Col>
				</Grid>

				{/* СЕКЦИИ ТАБЛИЦ */}
				<Box>
					<Text c='white' fw={800} fz='sm' mb='xl' tt='uppercase' lts='1.5px'>
						Financial Overview
					</Text>
					<Grid gutter='xl'>
						<ActivityTable title='Total Deposits' />
						<ActivityTable title='Total Withdrawal' />
						<ActivityTable title='Balance Reports' />
					</Grid>
				</Box>

				<Box>
					<Text c='white' fw={800} fz='sm' mb='xl' tt='uppercase' lts='1.5px'>
						Gaming Analytics
					</Text>
					<Grid gutter='xl'>
						<ActivityTable title='Total Bet' />
						<ActivityTable title='Total Win' />
						<ActivityTable title='Total Loss' />
						<ActivityTable title='Total GGR' />
					</Grid>
				</Box>
			</Stack>
		</Box>
	);
}

const ActivityTable = ({ title }: { title: string }) => (
	<Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
		<Paper className={styles.activityCard} radius='lg' overflow='hidden'>
			<Box p='lg'>
				<Text fz='xs' c='white' fw={800} mb='lg' tt='uppercase'>
					{title}
				</Text>
				{[1, 2, 3, 4].map((i) => (
					<Group key={i} justify='space-between' mb={8}>
						<Text fz={11} c='dimmed' fw={600}>
							Currency Fiat
						</Text>
						<Group gap={4}>
							<Text fz={11} c='white' fw={700}>
								0
							</Text>
							<Text fz={10} c='dimmed' fw={700}>
								USD
							</Text>
						</Group>
					</Group>
				))}
			</Box>
			<Box className={styles.tableFooter} p='md'>
				<Group justify='space-between'>
					<Text fz={11} fw={900} c='white' tt='uppercase'>
						Subtotal
					</Text>
					<Text fz={12} fw={900} c='white' ff='monospace'>
						0.00 USD
					</Text>
				</Group>
			</Box>
		</Paper>
	</Grid.Col>
);
