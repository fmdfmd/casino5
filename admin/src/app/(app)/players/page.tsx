// 'use client';

// import { useState } from 'react';
// import {
// 	Stack,
// 	Paper,
// 	Text,
// 	Group,
// 	Button,
// 	Box,
// 	Badge,
// 	Divider,
// 	Title,
// 	Table,
// 	ScrollArea,
// 	Avatar,
// 	ActionIcon,
// 	TextInput,
// 	SimpleGrid,
// 	Tabs,
// 	Pagination,
// 	Select,
// 	Tooltip,
// 	NumberInput,
// 	Flex,
// 	Textarea,
// 	PasswordInput,
// 	Radio,
// } from '@mantine/core';
// import {
// 	MagnifyingGlass,
// 	Funnel,
// 	User,
// 	Wallet,
// 	ShieldCheck,
// 	DeviceMobile,
// 	Desktop,
// 	Clock,
// 	Key,
// 	Trash,
// 	Prohibit,
// 	PaperPlaneTilt,
// 	PencilSimple,
// 	GoogleLogo,
// 	TelegramLogo,
// 	CheckCircle,
// 	MinusCircle,
// 	PlusCircle,
// 	Globe,
// 	ArrowSquareOut,
// 	IdentificationBadge,
// 	Warning,
// 	UserMinus,
// 	Plus,
// } from '@phosphor-icons/react';
// import styles from './Players.module.scss';

// // Типизация игрока
// interface Player {
// 	id: number;
// 	name: string;
// 	email: string;
// 	phone: string;
// 	balance: number;
// 	currency: string;
// 	status: 'Bronze' | 'Silver' | 'Gold' | 'VIP' | 'Diamond';
// 	regDate: string;
// 	regTime: string;
// }

// export default function PlayersAdminPage() {
// 	const [selectedId, setSelectedId] = useState<number | null>(123);

// 	// Демо-данные (приходят с бэка)
// 	const [players] = useState<Player[]>([
// 		{
// 			id: 123,
// 			name: 'Profile1923',
// 			email: 'casino@winvibe.com',
// 			phone: '+1(234)567 89 00',
// 			balance: 590,
// 			currency: 'USD',
// 			status: 'Bronze',
// 			regDate: '12/03/2025',
// 			regTime: '12:28:19',
// 		},
// 		{
// 			id: 450,
// 			name: 'LuckyShark',
// 			email: 'shark@media.io',
// 			phone: '+44 7700 900 077',
// 			balance: 12050,
// 			currency: 'USDT',
// 			status: 'VIP',
// 			regDate: '10.01.2025',
// 			regTime: '15:10:02',
// 		},
// 		{
// 			id: 991,
// 			name: 'CryptoKing',
// 			email: 'boss@crypto.net',
// 			phone: '+34 912 33 44 55',
// 			balance: 140.2,
// 			currency: 'BTC',
// 			status: 'Diamond',
// 			regDate: '01.01.2026',
// 			regTime: '09:00:45',
// 		},
// 	]);

// 	const activePlayer = players.find((p) => p.id === selectedId) || players[0];

// 	return (
// 		<Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
// 			<Stack gap='xl'>
// 				{/* --- ВЕРХНЯЯ ПАНЕЛЬ: ПОИСК И КНОПКИ --- */}
// 				<Paper className={styles.card} p='xl'>
// 					<Flex
// 						justify='space-between'
// 						align='center'
// 						mb='xl'
// 						wrap='wrap'
// 						gap='md'
// 					>
// 						<Title
// 							order={2}
// 							c='white'
// 							fz={{ base: '22px', sm: '30px' }}
// 							fw={900}
// 						>
// 							Players Management
// 						</Title>
// 						<Group>
// 							<Button
// 								variant='light'
// 								color='red'
// 								leftSection={<LinkBreak size={18} />}
// 							>
// 								Clear Sessions
// 							</Button>
// 							<Button
// 								color='blue'
// 								h={44}
// 								radius='md'
// 								leftSection={<Plus size={20} weight='bold' />}
// 							>
// 								Create Player
// 							</Button>
// 						</Group>
// 					</Flex>

// 					<SimpleGrid cols={{ base: 1, sm: 3 }} spacing='lg'>
// 						<TextInput
// 							label='Quick Search'
// 							placeholder='UID, Name or Email'
// 							className={styles.customInput}
// 							leftSection={<MagnifyingGlass size={18} color='#3b82f6' />}
// 						/>
// 						<Select
// 							label='Rank Filter'
// 							placeholder='All VIP Levels'
// 							data={['Bronze', 'Silver', 'Gold', 'VIP', 'Diamond']}
// 							className={styles.customInput}
// 							comboboxProps={{
// 								classNames: { dropdown: styles.selectDropdown },
// 							}}
// 						/>
// 						<Flex align='flex-end'>
// 							<Button
// 								fullWidth
// 								h={44}
// 								radius='md'
// 								color='blue'
// 								leftSection={<Funnel size={18} />}
// 							>
// 								Apply Filters
// 							</Button>
// 						</Flex>
// 					</SimpleGrid>
// 				</Paper>

// 				{/* --- ТАБЛИЦА ИГРОКОВ --- */}
// 				<Paper className={styles.card}>
// 					<ScrollArea scrollbars='x'>
// 						<Table verticalSpacing='md' minWidth={1100}>
// 							<Table.Thead className={styles.tableHeader}>
// 								<Table.Tr>
// 									<Table.Th w={60}>Select</Table.Th>
// 									<Table.Th>ID</Table.Th>
// 									<Table.Th>Player Profile</Table.Th>
// 									<Table.Th>Balance</Table.Th>
// 									<Table.Th>Status</Table.Th>
// 									<Table.Th>Registration</Table.Th>
// 									<Table.Th textAlign='right'>Quick Action</Table.Th>
// 								</Table.Tr>
// 							</Table.Thead>
// 							<Table.Tbody>
// 								{players.map((p) => (
// 									<Table.Tr
// 										key={p.id}
// 										className={styles.tableRow}
// 										data-selected={selectedId === p.id}
// 										onClick={() => setSelectedId(p.id)}
// 									>
// 										<Table.Td>
// 											<Radio
// 												checked={selectedId === p.id}
// 												readOnly
// 												color='blue'
// 											/>
// 										</Table.Td>
// 										<Table.Td>
// 											<Text fw={900} c='blue.2'>
// 												#{p.id}
// 											</Text>
// 										</Table.Td>
// 										<Table.Td>
// 											<Group gap='sm' wrap='nowrap'>
// 												<Avatar radius='md' color='blue' fw={800}>
// 													{p.name[0]}
// 												</Avatar>
// 												<Box>
// 													<Text fw={700} fz='sm' c='white'>
// 														{p.name}
// 													</Text>
// 													<Text fz='xs' c='dimmed'>
// 														{p.email}
// 													</Text>
// 												</Box>
// 											</Group>
// 										</Table.Td>
// 										<Table.Td>
// 											<Text fw={800} c='green.4'>
// 												{p.balance.toLocaleString()} {p.currency}
// 											</Text>
// 										</Table.Td>
// 										<Table.Td>
// 											<Badge color='blue' variant='filled' radius='sm'>
// 												{p.status}
// 											</Badge>
// 										</Table.Td>
// 										<Table.Td>
// 											<Text fz='xs' c='white'>
// 												{p.regDate}
// 											</Text>
// 											<Text fz='10px' c='blue.3'>
// 												{p.regTime}
// 											</Text>
// 										</Table.Td>
// 										<Table.Td>
// 											<Group gap='xs' justify='flex-end'>
// 												<ActionIcon variant='light' color='blue' size='sm'>
// 													<ArrowSquareOut />
// 												</ActionIcon>
// 												<ActionIcon variant='light' color='red' size='sm'>
// 													<Prohibit />
// 												</ActionIcon>
// 											</Group>
// 										</Table.Td>
// 									</Table.Tr>
// 								))}
// 							</Table.Tbody>
// 						</Table>
// 					</ScrollArea>
// 					<Flex p='lg' justify='center' bg='rgba(0,0,0,0.1)'>
// 						<Pagination
// 							total={15}
// 							radius='md'
// 							className={styles.paginationCustom}
// 						/>
// 					</Flex>
// 				</Paper>

// 				{/* --- ДЕТАЛЬНОЕ УПРАВЛЕНИЕ (MASTER-DETAIL) --- */}
// 				<Paper className={styles.card}>
// 					<Tabs defaultValue='info' color='blue'>
// 						<Tabs.List p='md' bg='rgba(0,0,0,0.1)'>
// 							<Tabs.Tab
// 								value='info'
// 								leftSection={<IdentificationBadge size={16} />}
// 							>
// 								Main Info
// 							</Tabs.Tab>
// 							<Tabs.Tab value='finance' leftSection={<Wallet size={16} />}>
// 								Balance Management
// 							</Tabs.Tab>
// 							<Tabs.Tab value='safety' leftSection={<ShieldCheck size={16} />}>
// 								Safety & History
// 							</Tabs.Tab>
// 						</Tabs.List>

// 						{/* --- ВКЛАДКА: ИНФО --- */}
// 						<Tabs.Panel value='info' p='xl'>
// 							<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
// 								<Stack gap='lg'>
// 									<Box className={styles.detailBlock}>
// 										<Title order={5} c='white' mb='xl'>
// 											Account Profile
// 										</Title>
// 										<SimpleGrid cols={2} spacing='lg'>
// 											<InfoBox label='UID' value={`#${activePlayer.id}`} />
// 											<InfoBox
// 												label='Full Name'
// 												value={activePlayer.name}
// 												editable
// 											/>
// 											<InfoBox
// 												label='Phone'
// 												value={activePlayer.phone}
// 												editable
// 											/>
// 											<InfoBox
// 												label='Email'
// 												value={activePlayer.email}
// 												editable
// 											/>
// 											<InfoBox
// 												label='Rank'
// 												value={activePlayer.status}
// 												isBadge
// 											/>
// 											<InfoBox
// 												label='Registered'
// 												value={`${activePlayer.regDate} ${activePlayer.regTime}`}
// 											/>
// 										</SimpleGrid>
// 									</Box>
// 									<Box className={styles.detailBlock}>
// 										<Title order={5} c='white' mb='md'>
// 											Admin Notes
// 										</Title>
// 										<Textarea
// 											placeholder='Add internal comment...'
// 											className={styles.customInput}
// 											minRows={3}
// 										/>
// 										<Button
// 											mt='md'
// 											fullWidth
// 											color='blue'
// 											leftSection={<PaperPlaneTilt size={16} />}
// 										>
// 											Save Note
// 										</Button>
// 									</Box>
// 								</Stack>

// 								<Stack gap='lg'>
// 									<Box className={styles.detailBlock}>
// 										<Title order={5} c='white' mb='md'>
// 											Password Reset
// 										</Title>
// 										<PasswordInput
// 											placeholder='New Secure Password'
// 											className={styles.customInput}
// 											mb='sm'
// 										/>
// 										<Button
// 											fullWidth
// 											variant='light'
// 											color='blue'
// 											leftSection={<Key size={18} />}
// 										>
// 											Update Password
// 										</Button>
// 									</Box>
// 									<Box className={styles.detailBlock}>
// 										<Title order={5} c='white' mb='md'>
// 											Social Auth
// 										</Title>
// 										<Group gap='xl'>
// 											<Tooltip label='Linked via Google Account'>
// 												<GoogleLogo size={32} color='#ea4335' weight='fill' />
// 											</Tooltip>
// 											<Tooltip label='Telegram Synced'>
// 												<TelegramLogo size={32} color='#0088cc' weight='fill' />
// 											</Tooltip>
// 										</Group>
// 									</Box>
// 								</Stack>
// 							</SimpleGrid>
// 						</Tabs.Panel>

// 						{/* --- ВКЛАДКА: ФИНАНСЫ --- */}
// 						<Tabs.Panel value='finance' p='xl'>
// 							<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
// 								<Box className={styles.detailBlock}>
// 									<Title order={5} c='white' mb='xl'>
// 										Balance Adjustment
// 									</Title>
// 									<Stack gap='lg'>
// 										<Group grow>
// 											<NumberInput
// 												label='Enter Amount'
// 												placeholder='0.00'
// 												className={styles.customInput}
// 												prefix='$'
// 											/>
// 											<Select
// 												label='Asset'
// 												data={['USD', 'USDT', 'BTC', 'EUR']}
// 												defaultValue='USD'
// 												className={styles.customInput}
// 												comboboxProps={{
// 													classNames: { dropdown: styles.selectDropdown },
// 												}}
// 											/>
// 										</Group>
// 										<Group grow gap='md'>
// 											<Button
// 												h={52}
// 												color='green'
// 												radius='md'
// 												leftSection={<PlusCircle size={24} />}
// 											>
// 												Add Balance
// 											</Button>
// 											<Button
// 												h={52}
// 												color='red'
// 												radius='md'
// 												leftSection={<MinusCircle size={24} />}
// 											>
// 												Subtract Balance
// 											</Button>
// 										</Group>
// 									</Stack>
// 								</Box>
// 								<Box className={styles.detailBlock}>
// 									<Title order={5} c='white' mb='md'>
// 										Recent Transactions
// 									</Title>
// 									<ScrollArea h={200}>
// 										<Stack gap={8}>
// 											<Box
// 												p='sm'
// 												bg='rgba(16, 185, 129, 0.1)'
// 												style={{ borderRadius: '8px' }}
// 											>
// 												<Group justify='space-between'>
// 													<Text fz='xs' fw={700}>
// 														+ 500.00 USD (Deposit)
// 													</Text>
// 													<Text fz='10px' c='dimmed'>
// 														Today, 10:15
// 													</Text>
// 												</Group>
// 											</Box>
// 											<Box
// 												p='sm'
// 												bg='rgba(239, 68, 68, 0.1)'
// 												style={{ borderRadius: '8px' }}
// 											>
// 												<Group justify='space-between'>
// 													<Text fz='xs' fw={700}>
// 														- 200.00 USD (Correction)
// 													</Text>
// 													<Text fz='10px' c='dimmed'>
// 														Yesterday
// 													</Text>
// 												</Group>
// 											</Box>
// 										</Stack>
// 									</ScrollArea>
// 								</Box>
// 							</SimpleGrid>
// 						</Tabs.Panel>

// 						{/* --- ВКЛАДКА: БЕЗОПАСНОСТЬ --- */}
// 						<Tabs.Panel value='safety' p='xl'>
// 							<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
// 								<Box
// 									className={styles.detailBlock}
// 									style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}
// 								>
// 									<Title order={5} c='red.5' mb='xl'>
// 										Danger Actions
// 									</Title>
// 									<Stack gap='md'>
// 										<Button
// 											color='red'
// 											h={50}
// 											leftSection={<Prohibit size={20} />}
// 										>
// 											BAN PLAYER PERMANENTLY
// 										</Button>
// 										<Button
// 											variant='outline'
// 											color='orange'
// 											h={50}
// 											leftSection={<Warning size={20} />}
// 										>
// 											Temporary Mute
// 										</Button>
// 										<Button
// 											variant='subtle'
// 											color='red'
// 											h={40}
// 											leftSection={<UserMinus size={18} />}
// 										>
// 											Delete User Data
// 										</Button>
// 									</Stack>
// 								</Box>
// 								<Box className={styles.detailBlock}>
// 									<Title order={5} c='white' mb='md'>
// 										Device History
// 									</Title>
// 									<Stack gap='xs'>
// 										<DeviceLine
// 											icon={<Desktop size={14} />}
// 											name='Windows 11 / Edge'
// 											ip='185.12.44.1'
// 											loc='London, UK'
// 										/>
// 										<DeviceLine
// 											icon={<DeviceMobile size={14} />}
// 											name='iPhone 15 / Safari'
// 											ip='102.11.10.4'
// 											loc='Warsaw, PL'
// 										/>
// 									</Stack>
// 								</Box>
// 							</SimpleGrid>
// 						</Tabs.Panel>
// 					</Tabs>
// 				</Paper>
// 			</Stack>
// 		</Box>
// 	);
// }

// // --- ХЕЛПЕРЫ ДЛЯ ВЕРСТКИ ---

// function InfoBox({ label, value, editable, isBadge }: any) {
// 	return (
// 		<Box>
// 			<Text fz='xs' c='blue.2' fw={800} tt='uppercase' lts='0.5px' mb={4}>
// 				{label}
// 			</Text>
// 			<Group gap={6}>
// 				{isBadge ? (
// 					<Badge color='blue' radius='sm'>
// 						{value}
// 					</Badge>
// 				) : (
// 					<Text fw={700} fz='sm' c='white'>
// 						{value}
// 					</Text>
// 				)}
// 				{editable && (
// 					<ActionIcon variant='subtle' size='xs' color='blue'>
// 						<PencilSimple size={12} />
// 					</ActionIcon>
// 				)}
// 			</Group>
// 		</Box>
// 	);
// }

// function DeviceLine({ icon, name, ip, loc }: any) {
// 	return (
// 		<Group justify='space-between' className={styles.deviceItem}>
// 			<Group gap='sm'>
// 				<Box opacity={0.6} c='blue.3'>
// 					{icon}
// 				</Box>
// 				<Box>
// 					<Text fz='xs' fw={700} c='white'>
// 						{name}
// 					</Text>
// 					<Text fz='10px' c='dimmed'>
// 						{ip} • {loc}
// 					</Text>
// 				</Box>
// 			</Group>
// 			<Badge size='xs' variant='dot' color='green'>
// 				Active
// 			</Badge>
// 		</Group>
// 	);
// }

// function LinkBreak({ size }: { size: number }) {
// 	return <Globe size={size} />; // Заглушка для иконки
// }

'use client';

import { useState, useEffect } from 'react';
import {
	Stack,
	Paper,
	Text,
	Group,
	Button,
	Box,
	Badge,
	Title,
	Table,
	ScrollArea,
	Avatar,
	ActionIcon,
	TextInput,
	SimpleGrid,
	Tabs,
	Pagination,
	Select,
	Tooltip,
	NumberInput,
	Flex,
	Textarea,
	PasswordInput,
	Radio,
	LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import {
	MagnifyingGlass,
	Funnel,
	Wallet,
	ShieldCheck,
	DeviceMobile,
	Desktop,
	Key,
	Prohibit,
	PaperPlaneTilt,
	PencilSimple,
	GoogleLogo,
	TelegramLogo,
	PlusCircle,
	MinusCircle,
	ArrowSquareOut,
	IdentificationBadge,
	Warning,
	UserMinus,
	Plus,
	CheckCircle,
} from '@phosphor-icons/react';
import { api } from '@/shared/lib/api/axios'; // Ваш Axios
import styles from './Players.module.scss';

export default function PlayersAdminPage() {
	// --- STATE ---
	const [players, setPlayers] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);

	// Выбранный игрок
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [activePlayer, setActivePlayer] = useState<any>(null); // Детальные данные
	const [detailLoading, setDetailLoading] = useState(false);

	// Форма финансов
	const [adjustAmount, setAdjustAmount] = useState<number | string>('');
	const [adjustReason, setAdjustReason] = useState('Admin Bonus');

	// --- FETCH СПИСКА ИГРОКОВ ---
	const fetchPlayers = async () => {
		setLoading(true);
		try {
			const res = await api.get('/admin/users', {
				params: { page, search, status: statusFilter },
			});
			setPlayers(res.data.data);
			setTotal(res.data.total);
			if (res.data.data.length > 0 && !selectedId) {
				setSelectedId(res.data.data[0].id);
			}
		} catch (e) {
			notifications.show({
				title: 'Error',
				message: 'Failed to load players',
				color: 'red',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const delay = setTimeout(() => {
			fetchPlayers();
		}, 500); // Debounce поиска
		return () => clearTimeout(delay);
	}, [page, search, statusFilter]);

	// --- FETCH ДЕТАЛЕЙ ОДНОГО ИГРОКА ---
	useEffect(() => {
		if (!selectedId) return;
		const fetchDetails = async () => {
			setDetailLoading(true);
			try {
				const res = await api.get(`/admin/users/${selectedId}`);
				setActivePlayer(res.data);
			} catch (e) {
				console.error(e);
			} finally {
				setDetailLoading(false);
			}
		};
		fetchDetails();
	}, [selectedId]);

	// --- ACTIONS ---

	// Изменение баланса (Вызов AdminFinance API из предыдущих ответов)
	const handleBalanceAdjustment = async (type: 'add' | 'subtract') => {
		if (!activePlayer || !adjustAmount) return;
		const walletId = activePlayer.walletsTable[0]?.id; // Берем основной кошелек
		if (!walletId)
			return notifications.show({
				message: 'User has no wallet',
				color: 'red',
			});

		const amountNum = Number(adjustAmount);
		const finalAmount = type === 'subtract' ? -amountNum : amountNum;

		try {
			await api.patch(`/admin/finance/wallets/${walletId}/adjust`, {
				amount: finalAmount,
				reason: adjustReason,
			});
			notifications.show({
				title: 'Success',
				message: 'Balance updated',
				color: 'green',
			});
			// Перезагружаем детали юзера, чтобы увидеть новый баланс
			const res = await api.get(`/admin/users/${selectedId}`);
			setActivePlayer(res.data);
			setAdjustAmount('');
		} catch (e: any) {
			notifications.show({
				title: 'Error',
				message: e.response?.data?.message || 'Transaction failed',
				color: 'red',
			});
		}
	};

	// Бан игрока
	const handleChangeStatus = async (
		status: 'active' | 'banned' | 'suspended',
	) => {
		if (!activePlayer) return;
		try {
			await api.patch(`/admin/users/${activePlayer.id}/status`, { status });
			notifications.show({
				title: 'Status Updated',
				message: `Player is now ${status}`,
				color: 'orange',
			});
			setActivePlayer({ ...activePlayer, status });
			fetchPlayers(); // Обновляем список
		} catch (e) {
			notifications.show({
				title: 'Error',
				message: 'Could not update status',
				color: 'red',
			});
		}
	};

	return (
		<Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
			<Stack gap='xl'>
				{/* --- ВЕРХНЯЯ ПАНЕЛЬ: ПОИСК --- */}
				<Paper className={styles.card} p='xl' pos='relative'>
					<LoadingOverlay
						visible={loading}
						zIndex={10}
						overlayProps={{ blur: 1 }}
					/>
					<Flex
						justify='space-between'
						align='center'
						mb='xl'
						wrap='wrap'
						gap='md'
					>
						<Title
							order={2}
							c='white'
							fz={{ base: '22px', sm: '30px' }}
							fw={900}
						>
							Players Management
						</Title>
						<Group>
							<Button
								color='blue'
								h={44}
								radius='md'
								leftSection={<Plus size={20} weight='bold' />}
							>
								Create Player
							</Button>
						</Group>
					</Flex>

					<SimpleGrid cols={{ base: 1, sm: 3 }} spacing='lg'>
						<TextInput
							label='Quick Search'
							placeholder='UID, Name or Email'
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
							className={styles.customInput}
							leftSection={<MagnifyingGlass size={18} color='#3b82f6' />}
						/>
						<Select
							label='Status Filter'
							placeholder='All Users'
							data={[
								{ value: 'active', label: 'Active' },
								{ value: 'suspended', label: 'Suspended' },
								{ value: 'banned', label: 'Banned' },
							]}
							value={statusFilter}
							onChange={setStatusFilter}
							clearable
							className={styles.customInput}
						/>
					</SimpleGrid>
				</Paper>

				{/* --- ТАБЛИЦА ИГРОКОВ --- */}
				<Paper className={styles.card} pos='relative'>
					<LoadingOverlay
						visible={loading}
						zIndex={10}
						overlayProps={{ blur: 1 }}
					/>
					<ScrollArea scrollbars='x'>
						<Table verticalSpacing='md' minWidth={1100}>
							<Table.Thead className={styles.tableHeader}>
								<Table.Tr>
									<Table.Th w={60}>Select</Table.Th>
									<Table.Th>ID</Table.Th>
									<Table.Th>Player Profile</Table.Th>
									<Table.Th>Main Balance</Table.Th>
									<Table.Th>Status / VIP</Table.Th>
									<Table.Th>Registration</Table.Th>
									<Table.Th textAlign='right'>Action</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{players.map((p) => {
									const mainWallet = p.walletsTable?.[0]; // Предполагаем первый кошелек USDT
									return (
										<Table.Tr
											key={p.id}
											className={styles.tableRow}
											data-selected={selectedId === p.id}
											onClick={() => setSelectedId(p.id)}
											style={{ cursor: 'pointer' }}
										>
											<Table.Td>
												<Radio
													checked={selectedId === p.id}
													readOnly
													color='blue'
												/>
											</Table.Td>
											<Table.Td>
												<Tooltip label={p.id}>
													<Text fw={900} c='blue.2'>
														#{p.id.substring(0, 6)}
													</Text>
												</Tooltip>
											</Table.Td>
											<Table.Td>
												<Group gap='sm' wrap='nowrap'>
													<Avatar
														radius='md'
														color={p.status === 'banned' ? 'red' : 'blue'}
														fw={800}
													>
														{(p.username || p.email)[0].toUpperCase()}
													</Avatar>
													<Box>
														<Text fw={700} fz='sm' c='white'>
															{p.username || 'No Name'}
														</Text>
														<Text fz='xs' c='dimmed'>
															{p.email}
														</Text>
													</Box>
												</Group>
											</Table.Td>
											<Table.Td>
												{mainWallet ? (
													<Text fw={800} c='green.4'>
														{Number(mainWallet.realBalance).toFixed(2)}{' '}
														{mainWallet.currency?.symbol}
													</Text>
												) : (
													<Text c='dimmed' size='xs'>
														No Wallet
													</Text>
												)}
											</Table.Td>
											<Table.Td>
												<Group gap={4}>
													<Badge
														color={p.status === 'active' ? 'green' : 'red'}
														variant='filled'
														radius='sm'
													>
														{p.status}
													</Badge>
													<Badge color='grape' variant='outline' radius='sm'>
														VIP {p.vipLevel}
													</Badge>
												</Group>
											</Table.Td>
											<Table.Td>
												<Text fz='xs' c='white'>
													{dayjs(p.createdAt).format('DD/MM/YYYY')}
												</Text>
												<Text fz='10px' c='blue.3'>
													{dayjs(p.createdAt).format('HH:mm:ss')}
												</Text>
											</Table.Td>
											<Table.Td>
												<Group gap='xs' justify='flex-end'>
													<ActionIcon
														variant='light'
														color='blue'
														size='sm'
														component='a'
														href={`/admin/users/${p.id}`}
														target='_blank'
													>
														<ArrowSquareOut />
													</ActionIcon>
												</Group>
											</Table.Td>
										</Table.Tr>
									);
								})}
							</Table.Tbody>
						</Table>
					</ScrollArea>
					<Flex p='lg' justify='center' bg='rgba(0,0,0,0.1)'>
						<Pagination
							total={Math.ceil(total / 15)}
							value={page}
							onChange={setPage}
							radius='md'
							color='blue'
						/>
					</Flex>
				</Paper>

				{/* --- ДЕТАЛЬНОЕ УПРАВЛЕНИЕ --- */}
				{activePlayer && (
					<Paper className={styles.card} pos='relative'>
						<LoadingOverlay
							visible={detailLoading}
							zIndex={10}
							overlayProps={{ blur: 1 }}
						/>
						<Tabs defaultValue='info' color='blue'>
							<Tabs.List p='md' bg='rgba(0,0,0,0.1)'>
								<Tabs.Tab
									value='info'
									leftSection={<IdentificationBadge size={16} />}
								>
									Main Info
								</Tabs.Tab>
								<Tabs.Tab value='finance' leftSection={<Wallet size={16} />}>
									Balance & Ledger
								</Tabs.Tab>
								<Tabs.Tab
									value='safety'
									leftSection={<ShieldCheck size={16} />}
								>
									Safety & Actions
								</Tabs.Tab>
							</Tabs.List>

							{/* INFO TAB */}
							<Tabs.Panel value='info' p='xl'>
								<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
									<Stack gap='lg'>
										<Box className={styles.detailBlock}>
											<Title order={5} c='white' mb='xl'>
												Account Profile
											</Title>
											<SimpleGrid cols={2} spacing='lg'>
												<InfoBox label='UID' value={activePlayer.id} />
												<InfoBox
													label='Username'
													value={activePlayer.username || 'N/A'}
													editable
												/>
												<InfoBox
													label='Email'
													value={activePlayer.email}
													editable
												/>
												<InfoBox
													label='KYC Level'
													value={activePlayer.kycLevel}
													isBadge
												/>
												<InfoBox
													label='Registered'
													value={dayjs(activePlayer.createdAt).format(
														'DD MMM YYYY, HH:mm',
													)}
												/>
												<InfoBox
													label='Wagered'
													value={`$${Number(activePlayer.totalWageredUsd).toFixed(2)}`}
												/>
											</SimpleGrid>
										</Box>
									</Stack>

									<Stack gap='lg'>
										<Box className={styles.detailBlock}>
											<Title order={5} c='white' mb='md'>
												Social Auth & Risk
											</Title>
											<Group gap='xl' mb='md'>
												{activePlayer.provider === 'google' && (
													<Tooltip label='Linked via Google'>
														<GoogleLogo
															size={32}
															color='#ea4335'
															weight='fill'
														/>
													</Tooltip>
												)}
												{activePlayer.provider === 'telegram' && (
													<Tooltip label='Telegram Synced'>
														<TelegramLogo
															size={32}
															color='#0088cc'
															weight='fill'
														/>
													</Tooltip>
												)}
												{activePlayer.provider === 'local' && (
													<Badge color='gray'>Email/Password</Badge>
												)}
											</Group>

											<Text fz='xs' c='dimmed' mb={4}>
												Risk Score
											</Text>
											<Badge
												color={activePlayer.riskScore > 80 ? 'red' : 'green'}
												size='lg'
											>
												{activePlayer.riskScore} / 100
											</Badge>
										</Box>
									</Stack>
								</SimpleGrid>
							</Tabs.Panel>

							{/* FINANCE TAB */}
							<Tabs.Panel value='finance' p='xl'>
								<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='xl'>
											Manual Balance Adjustment
										</Title>
										<Stack gap='lg'>
											<Group grow>
												<NumberInput
													label='Enter Amount'
													placeholder='0.00'
													value={adjustAmount}
													onChange={setAdjustAmount}
													className={styles.customInput}
													hideControls
												/>
												<TextInput
													label='Reason (Audit)'
													value={adjustReason}
													onChange={(e) =>
														setAdjustReason(e.currentTarget.value)
													}
													className={styles.customInput}
												/>
											</Group>
											<Group grow gap='md'>
												<Button
													h={52}
													color='green'
													radius='md'
													onClick={() => handleBalanceAdjustment('add')}
													leftSection={<PlusCircle size={24} />}
												>
													Add Funds
												</Button>
												<Button
													h={52}
													color='red'
													radius='md'
													onClick={() => handleBalanceAdjustment('subtract')}
													leftSection={<MinusCircle size={24} />}
												>
													Deduct Funds
												</Button>
											</Group>
										</Stack>
									</Box>

									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='md'>
											Recent Ledger (Last 10)
										</Title>
										<ScrollArea h={250}>
											<Stack gap={8}>
												{activePlayer.recentTx?.length === 0 && (
													<Text c='dimmed' size='sm'>
														No transactions yet
													</Text>
												)}
												{activePlayer.recentTx?.map((tx: any) => {
													const isPositive = Number(tx.amount) > 0;
													return (
														<Box
															key={tx.id}
															p='sm'
															bg={
																isPositive
																	? 'rgba(16, 185, 129, 0.1)'
																	: 'rgba(239, 68, 68, 0.1)'
															}
															style={{ borderRadius: '8px' }}
														>
															<Group justify='space-between'>
																<Text
																	fz='xs'
																	fw={700}
																	c={isPositive ? 'green.4' : 'red.4'}
																>
																	{isPositive ? '+' : ''}
																	{Number(tx.amount).toFixed(2)} ({tx.type})
																</Text>
																<Text fz='10px' c='dimmed'>
																	{dayjs(tx.createdAt).format('DD MMM, HH:mm')}
																</Text>
															</Group>
															<Text fz='10px' c='gray.5' mt={4}>
																{tx.description}
															</Text>
														</Box>
													);
												})}
											</Stack>
										</ScrollArea>
									</Box>
								</SimpleGrid>
							</Tabs.Panel>

							{/* SAFETY TAB */}
							<Tabs.Panel value='safety' p='xl'>
								<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
									<Box
										className={styles.detailBlock}
										style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}
									>
										<Title order={5} c='red.5' mb='xl'>
											Danger Actions
										</Title>
										<Stack gap='md'>
											{activePlayer.status === 'banned' ? (
												<Button
													color='green'
													h={50}
													leftSection={<CheckCircle size={20} />}
													onClick={() => handleChangeStatus('active')}
												>
													UNBAN PLAYER
												</Button>
											) : (
												<Button
													color='red'
													h={50}
													leftSection={<Prohibit size={20} />}
													onClick={() => handleChangeStatus('banned')}
												>
													BAN PLAYER PERMANENTLY
												</Button>
											)}

											<Button
												variant='outline'
												color='orange'
												h={50}
												leftSection={<Warning size={20} />}
												onClick={() => handleChangeStatus('suspended')}
											>
												Suspend Account (Mute)
											</Button>
										</Stack>
									</Box>
								</SimpleGrid>
							</Tabs.Panel>
						</Tabs>
					</Paper>
				)}
			</Stack>
		</Box>
	);
}

// --- ХЕЛПЕРЫ ---
function InfoBox({ label, value, editable, isBadge }: any) {
	return (
		<Box>
			<Text fz='xs' c='blue.2' fw={800} tt='uppercase' lts='0.5px' mb={4}>
				{label}
			</Text>
			<Group gap={6}>
				{isBadge ? (
					<Badge color='blue' radius='sm'>
						{value}
					</Badge>
				) : (
					<Text fw={700} fz='sm' c='white' style={{ wordBreak: 'break-all' }}>
						{value}
					</Text>
				)}
			</Group>
		</Box>
	);
}
