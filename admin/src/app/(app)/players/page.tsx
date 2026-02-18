'use client';

import { useState } from 'react';
import {
	Stack,
	Paper,
	Text,
	Group,
	Button,
	Box,
	Badge,
	Divider,
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
} from '@mantine/core';
import {
	MagnifyingGlass,
	Funnel,
	User,
	Wallet,
	ShieldCheck,
	DeviceMobile,
	Desktop,
	Clock,
	Key,
	Trash,
	Prohibit,
	PaperPlaneTilt,
	PencilSimple,
	GoogleLogo,
	TelegramLogo,
	CheckCircle,
	MinusCircle,
	PlusCircle,
	Globe,
	ArrowSquareOut,
	IdentificationBadge,
	Warning,
	UserMinus,
	Plus,
} from '@phosphor-icons/react';
import styles from './Players.module.scss';

// Типизация игрока
interface Player {
	id: number;
	name: string;
	email: string;
	phone: string;
	balance: number;
	currency: string;
	status: 'Bronze' | 'Silver' | 'Gold' | 'VIP' | 'Diamond';
	regDate: string;
	regTime: string;
}

export default function PlayersAdminPage() {
	const [selectedId, setSelectedId] = useState<number | null>(123);

	// Демо-данные (приходят с бэка)
	const [players] = useState<Player[]>([
		{
			id: 123,
			name: 'Profile1923',
			email: 'casino@winvibe.com',
			phone: '+1(234)567 89 00',
			balance: 590,
			currency: 'USD',
			status: 'Bronze',
			regDate: '12/03/2025',
			regTime: '12:28:19',
		},
		{
			id: 450,
			name: 'LuckyShark',
			email: 'shark@media.io',
			phone: '+44 7700 900 077',
			balance: 12050,
			currency: 'USDT',
			status: 'VIP',
			regDate: '10.01.2025',
			regTime: '15:10:02',
		},
		{
			id: 991,
			name: 'CryptoKing',
			email: 'boss@crypto.net',
			phone: '+34 912 33 44 55',
			balance: 140.2,
			currency: 'BTC',
			status: 'Diamond',
			regDate: '01.01.2026',
			regTime: '09:00:45',
		},
	]);

	const activePlayer = players.find((p) => p.id === selectedId) || players[0];

	return (
		<Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
			<Stack gap='xl'>
				{/* --- ВЕРХНЯЯ ПАНЕЛЬ: ПОИСК И КНОПКИ --- */}
				<Paper className={styles.card} p='xl'>
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
								variant='light'
								color='red'
								leftSection={<LinkBreak size={18} />}
							>
								Clear Sessions
							</Button>
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
							className={styles.customInput}
							leftSection={<MagnifyingGlass size={18} color='#3b82f6' />}
						/>
						<Select
							label='Rank Filter'
							placeholder='All VIP Levels'
							data={['Bronze', 'Silver', 'Gold', 'VIP', 'Diamond']}
							className={styles.customInput}
							comboboxProps={{
								classNames: { dropdown: styles.selectDropdown },
							}}
						/>
						<Flex align='flex-end'>
							<Button
								fullWidth
								h={44}
								radius='md'
								color='blue'
								leftSection={<Funnel size={18} />}
							>
								Apply Filters
							</Button>
						</Flex>
					</SimpleGrid>
				</Paper>

				{/* --- ТАБЛИЦА ИГРОКОВ --- */}
				<Paper className={styles.card}>
					<ScrollArea scrollbars='x'>
						<Table verticalSpacing='md' minWidth={1100}>
							<Table.Thead className={styles.tableHeader}>
								<Table.Tr>
									<Table.Th w={60}>Select</Table.Th>
									<Table.Th>ID</Table.Th>
									<Table.Th>Player Profile</Table.Th>
									<Table.Th>Balance</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Registration</Table.Th>
									<Table.Th textAlign='right'>Quick Action</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{players.map((p) => (
									<Table.Tr
										key={p.id}
										className={styles.tableRow}
										data-selected={selectedId === p.id}
										onClick={() => setSelectedId(p.id)}
									>
										<Table.Td>
											<Radio
												checked={selectedId === p.id}
												readOnly
												color='blue'
											/>
										</Table.Td>
										<Table.Td>
											<Text fw={900} c='blue.2'>
												#{p.id}
											</Text>
										</Table.Td>
										<Table.Td>
											<Group gap='sm' wrap='nowrap'>
												<Avatar radius='md' color='blue' fw={800}>
													{p.name[0]}
												</Avatar>
												<Box>
													<Text fw={700} fz='sm' c='white'>
														{p.name}
													</Text>
													<Text fz='xs' c='dimmed'>
														{p.email}
													</Text>
												</Box>
											</Group>
										</Table.Td>
										<Table.Td>
											<Text fw={800} c='green.4'>
												{p.balance.toLocaleString()} {p.currency}
											</Text>
										</Table.Td>
										<Table.Td>
											<Badge color='blue' variant='filled' radius='sm'>
												{p.status}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Text fz='xs' c='white'>
												{p.regDate}
											</Text>
											<Text fz='10px' c='blue.3'>
												{p.regTime}
											</Text>
										</Table.Td>
										<Table.Td>
											<Group gap='xs' justify='flex-end'>
												<ActionIcon variant='light' color='blue' size='sm'>
													<ArrowSquareOut />
												</ActionIcon>
												<ActionIcon variant='light' color='red' size='sm'>
													<Prohibit />
												</ActionIcon>
											</Group>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</ScrollArea>
					<Flex p='lg' justify='center' bg='rgba(0,0,0,0.1)'>
						<Pagination
							total={15}
							radius='md'
							className={styles.paginationCustom}
						/>
					</Flex>
				</Paper>

				{/* --- ДЕТАЛЬНОЕ УПРАВЛЕНИЕ (MASTER-DETAIL) --- */}
				<Paper className={styles.card}>
					<Tabs defaultValue='info' color='blue'>
						<Tabs.List p='md' bg='rgba(0,0,0,0.1)'>
							<Tabs.Tab
								value='info'
								leftSection={<IdentificationBadge size={16} />}
							>
								Main Info
							</Tabs.Tab>
							<Tabs.Tab value='finance' leftSection={<Wallet size={16} />}>
								Balance Management
							</Tabs.Tab>
							<Tabs.Tab value='safety' leftSection={<ShieldCheck size={16} />}>
								Safety & History
							</Tabs.Tab>
						</Tabs.List>

						{/* --- ВКЛАДКА: ИНФО --- */}
						<Tabs.Panel value='info' p='xl'>
							<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
								<Stack gap='lg'>
									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='xl'>
											Account Profile
										</Title>
										<SimpleGrid cols={2} spacing='lg'>
											<InfoBox label='UID' value={`#${activePlayer.id}`} />
											<InfoBox
												label='Full Name'
												value={activePlayer.name}
												editable
											/>
											<InfoBox
												label='Phone'
												value={activePlayer.phone}
												editable
											/>
											<InfoBox
												label='Email'
												value={activePlayer.email}
												editable
											/>
											<InfoBox
												label='Rank'
												value={activePlayer.status}
												isBadge
											/>
											<InfoBox
												label='Registered'
												value={`${activePlayer.regDate} ${activePlayer.regTime}`}
											/>
										</SimpleGrid>
									</Box>
									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='md'>
											Admin Notes
										</Title>
										<Textarea
											placeholder='Add internal comment...'
											className={styles.customInput}
											minRows={3}
										/>
										<Button
											mt='md'
											fullWidth
											color='blue'
											leftSection={<PaperPlaneTilt size={16} />}
										>
											Save Note
										</Button>
									</Box>
								</Stack>

								<Stack gap='lg'>
									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='md'>
											Password Reset
										</Title>
										<PasswordInput
											placeholder='New Secure Password'
											className={styles.customInput}
											mb='sm'
										/>
										<Button
											fullWidth
											variant='light'
											color='blue'
											leftSection={<Key size={18} />}
										>
											Update Password
										</Button>
									</Box>
									<Box className={styles.detailBlock}>
										<Title order={5} c='white' mb='md'>
											Social Auth
										</Title>
										<Group gap='xl'>
											<Tooltip label='Linked via Google Account'>
												<GoogleLogo size={32} color='#ea4335' weight='fill' />
											</Tooltip>
											<Tooltip label='Telegram Synced'>
												<TelegramLogo size={32} color='#0088cc' weight='fill' />
											</Tooltip>
										</Group>
									</Box>
								</Stack>
							</SimpleGrid>
						</Tabs.Panel>

						{/* --- ВКЛАДКА: ФИНАНСЫ --- */}
						<Tabs.Panel value='finance' p='xl'>
							<SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
								<Box className={styles.detailBlock}>
									<Title order={5} c='white' mb='xl'>
										Balance Adjustment
									</Title>
									<Stack gap='lg'>
										<Group grow>
											<NumberInput
												label='Enter Amount'
												placeholder='0.00'
												className={styles.customInput}
												prefix='$'
											/>
											<Select
												label='Asset'
												data={['USD', 'USDT', 'BTC', 'EUR']}
												defaultValue='USD'
												className={styles.customInput}
												comboboxProps={{
													classNames: { dropdown: styles.selectDropdown },
												}}
											/>
										</Group>
										<Group grow gap='md'>
											<Button
												h={52}
												color='green'
												radius='md'
												leftSection={<PlusCircle size={24} />}
											>
												Add Balance
											</Button>
											<Button
												h={52}
												color='red'
												radius='md'
												leftSection={<MinusCircle size={24} />}
											>
												Subtract Balance
											</Button>
										</Group>
									</Stack>
								</Box>
								<Box className={styles.detailBlock}>
									<Title order={5} c='white' mb='md'>
										Recent Transactions
									</Title>
									<ScrollArea h={200}>
										<Stack gap={8}>
											<Box
												p='sm'
												bg='rgba(16, 185, 129, 0.1)'
												style={{ borderRadius: '8px' }}
											>
												<Group justify='space-between'>
													<Text fz='xs' fw={700}>
														+ 500.00 USD (Deposit)
													</Text>
													<Text fz='10px' c='dimmed'>
														Today, 10:15
													</Text>
												</Group>
											</Box>
											<Box
												p='sm'
												bg='rgba(239, 68, 68, 0.1)'
												style={{ borderRadius: '8px' }}
											>
												<Group justify='space-between'>
													<Text fz='xs' fw={700}>
														- 200.00 USD (Correction)
													</Text>
													<Text fz='10px' c='dimmed'>
														Yesterday
													</Text>
												</Group>
											</Box>
										</Stack>
									</ScrollArea>
								</Box>
							</SimpleGrid>
						</Tabs.Panel>

						{/* --- ВКЛАДКА: БЕЗОПАСНОСТЬ --- */}
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
										<Button
											color='red'
											h={50}
											leftSection={<Prohibit size={20} />}
										>
											BAN PLAYER PERMANENTLY
										</Button>
										<Button
											variant='outline'
											color='orange'
											h={50}
											leftSection={<Warning size={20} />}
										>
											Temporary Mute
										</Button>
										<Button
											variant='subtle'
											color='red'
											h={40}
											leftSection={<UserMinus size={18} />}
										>
											Delete User Data
										</Button>
									</Stack>
								</Box>
								<Box className={styles.detailBlock}>
									<Title order={5} c='white' mb='md'>
										Device History
									</Title>
									<Stack gap='xs'>
										<DeviceLine
											icon={<Desktop size={14} />}
											name='Windows 11 / Edge'
											ip='185.12.44.1'
											loc='London, UK'
										/>
										<DeviceLine
											icon={<DeviceMobile size={14} />}
											name='iPhone 15 / Safari'
											ip='102.11.10.4'
											loc='Warsaw, PL'
										/>
									</Stack>
								</Box>
							</SimpleGrid>
						</Tabs.Panel>
					</Tabs>
				</Paper>
			</Stack>
		</Box>
	);
}

// --- ХЕЛПЕРЫ ДЛЯ ВЕРСТКИ ---

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
					<Text fw={700} fz='sm' c='white'>
						{value}
					</Text>
				)}
				{editable && (
					<ActionIcon variant='subtle' size='xs' color='blue'>
						<PencilSimple size={12} />
					</ActionIcon>
				)}
			</Group>
		</Box>
	);
}

function DeviceLine({ icon, name, ip, loc }: any) {
	return (
		<Group justify='space-between' className={styles.deviceItem}>
			<Group gap='sm'>
				<Box opacity={0.6} c='blue.3'>
					{icon}
				</Box>
				<Box>
					<Text fz='xs' fw={700} c='white'>
						{name}
					</Text>
					<Text fz='10px' c='dimmed'>
						{ip} • {loc}
					</Text>
				</Box>
			</Group>
			<Badge size='xs' variant='dot' color='green'>
				Active
			</Badge>
		</Group>
	);
}

function LinkBreak({ size }: { size: number }) {
	return <Globe size={size} />; // Заглушка для иконки
}
