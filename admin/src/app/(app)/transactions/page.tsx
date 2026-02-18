'use client';

import { useEffect, useState } from 'react';
import {
	Container,
	Title,
	Tabs,
	Table,
	Badge,
	ScrollArea,
	Group,
	Text,
	Button,
	ActionIcon,
	Modal,
	TextInput,
	Paper,
	CopyButton,
	LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCheck,
	IconX,
	IconArrowUpRight,
	IconArrowDownLeft,
	IconCopy,
	IconRefresh,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { api } from '@/shared/lib/api/axios';
import { useSocket } from '@/shared/hooks/useSocket';

export default function AdminTransactionsPage() {
	const [activeTab, setActiveTab] = useState<string | null>('pending');

	// ДВА РАЗНЫХ СОСТОЯНИЯ
	const [historyList, setHistoryList] = useState<any[]>([]); // Ledger items
	const [pendingList, setPendingList] = useState<any[]>([]); // Payments items

	const [loading, setLoading] = useState(true);
	const { socket, isConnected } = useSocket();

	// Modal State
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedTx, setSelectedTx] = useState<any>(null);
	const [txHash, setTxHash] = useState('');

	// --- FETCH DATA ---
	const fetchData = async () => {
		setLoading(true);
		try {
			const [historyRes, pendingRes] = await Promise.all([
				api.get('/admin/finance/history?limit=100'),
				api.get('/admin/finance/withdrawals/pending'),
			]);
			setHistoryList(historyRes.data);
			setPendingList(pendingRes.data);
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			setLoading(false);
		}
	};

	// --- SOCKETS ---
	useEffect(() => {
		fetchData(); // Первичная загрузка

		if (!socket || !isConnected) return;

		// 1. Новая запись в истории (Ledger) -> Добавляем в History Tab
		socket.on('new_transaction', (ledgerItem) => {
			setHistoryList((prev) => [ledgerItem, ...prev].slice(0, 100));
		});

		// 2. Обновление статуса платежа -> Убираем из Pending Tab
		socket.on('transaction_update', (paymentItem) => {
			if (paymentItem.status !== 'pending_approval') {
				setPendingList((prev) => prev.filter((p) => p.id !== paymentItem.id));
			} else {
				// Если вдруг пришла новая заявка (статус pending)
				// Но обычно для новой заявки лучше отдельное событие 'new_withdrawal_request'
				setPendingList((prev) => {
					if (prev.find((p) => p.id === paymentItem.id)) return prev;
					return [paymentItem, ...prev];
				});
			}
		});

		return () => {
			socket.off('new_transaction');
			socket.off('transaction_update');
		};
	}, [socket, isConnected]);

	// --- ACTIONS ---
	const openProcessModal = (tx: any) => {
		setSelectedTx(tx);
		setTxHash('');
		open();
	};

	const handleApprove = async () => {
		if (!selectedTx || !txHash) return;
		try {
			await api.post(`/admin/finance/withdrawals/${selectedTx.id}/approve`, {
				txHash,
			});
			close();
			// Оптимистичное удаление из списка (для мгновенной реакции интерфейса)
			setPendingList((prev) => prev.filter((tx) => tx.id !== selectedTx.id));
		} catch (e) {
			console.error(e);
			alert('Error approving withdrawal');
		}
	};

	const handleReject = async (id: string) => {
		if (!confirm('Are you sure? Funds will be refunded to user.')) return;
		try {
			await api.post(`/admin/finance/withdrawals/${id}/reject`);
			setPendingList((prev) => prev.filter((tx) => tx.id !== id));
		} catch (e) {
			console.error(e);
			alert('Error rejecting');
		}
	};

	// --- RENDER HELPERS ---

	// 1. Рендер ожидающих выводов
	const pendingRows = pendingList.map((tx) => (
		<Table.Tr key={tx.id}>
			<Table.Td>{dayjs(tx.createdAt).format('DD.MM HH:mm')}</Table.Td>
			<Table.Td>
				<Text size='sm' fw={500}>
					{tx.user?.email}
				</Text>
				<Text size='xs' c='dimmed'>
					ID: {tx.user?.username || 'No user'}
				</Text>
			</Table.Td>
			<Table.Td>
				<Text fw={700} c='red'>
					{tx.amount} {tx.wallet?.currency?.symbol}
				</Text>
				<Badge size='xs' variant='outline'>
					{tx.wallet?.currency?.network}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Group gap={5}>
					<Text
						size='xs'
						style={{ fontFamily: 'monospace', maxWidth: 150 }}
						truncate
					>
						{tx.toAddress}
					</Text>
					<CopyButton value={tx.toAddress}>
						{({ copied, copy }) => (
							<ActionIcon
								variant='subtle'
								color={copied ? 'teal' : 'gray'}
								onClick={copy}
								size='xs'
							>
								{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
							</ActionIcon>
						)}
					</CopyButton>
				</Group>
			</Table.Td>
			<Table.Td>
				<Group gap='xs'>
					<Button size='xs' color='green' onClick={() => openProcessModal(tx)}>
						Process
					</Button>
					<ActionIcon
						color='red'
						variant='light'
						onClick={() => handleReject(tx.id)}
					>
						<IconX size={16} />
					</ActionIcon>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	// 2. Рендер истории (Ledger)
	const historyRows = historyList.map((item) => {
		// Определяем цвет и иконку
		const isWinOrDeposit = item.amount > 0; // В вашей схеме Win и Deposit обычно положительные
		// Но для LedgerTable withdrawal обычно записывается как минус.
		// Если amount строка, приводим к числу: Number(item.amount)
		const amountVal = Number(item.amount);
		const isPositive = amountVal > 0;

		return (
			<Table.Tr key={item.id}>
				<Table.Td c='dimmed' size='xs'>
					{dayjs(item.createdAt).format('DD.MM HH:mm')}
				</Table.Td>
				<Table.Td>
					<Text size='sm'>
						{item.wallet?.user?.username || item.wallet?.user?.email}
					</Text>
				</Table.Td>
				<Table.Td>
					<Badge
						variant='light'
						color={
							item.type === 'deposit'
								? 'green'
								: item.type === 'withdrawal'
									? 'orange'
									: item.type === 'win'
										? 'teal'
										: item.type === 'bet'
											? 'gray'
											: 'blue'
						}
					>
						{item.type}
					</Badge>
				</Table.Td>
				<Table.Td>
					<Group gap={4}>
						{isPositive ? (
							<IconArrowDownLeft size={14} color='green' />
						) : (
							<IconArrowUpRight size={14} color='red' />
						)}
						<Text fw={500} c={isPositive ? 'green' : 'red'}>
							{Math.abs(amountVal)} {item.wallet?.currency?.symbol}
						</Text>
					</Group>
				</Table.Td>
				<Table.Td size='xs' c='dimmed' style={{ maxWidth: 200 }} truncate>
					{item.description || item.referenceId}
				</Table.Td>
			</Table.Tr>
		);
	});

	return (
		<Container fluid p='md'>
			<Group justify='space-between' mb='lg'>
				<Title order={3}>Finance Operations</Title>
				<Button
					leftSection={<IconRefresh size={16} />}
					variant='default'
					onClick={fetchData}
					loading={loading}
				>
					Refresh
				</Button>
			</Group>

			<Paper shadow='xs' p='md' withBorder pos='relative'>
				<LoadingOverlay
					visible={loading}
					zIndex={1000}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>

				<Tabs value={activeTab} onChange={setActiveTab}>
					<Tabs.List mb='md'>
						<Tabs.Tab
							value='pending'
							leftSection={
								pendingList.length > 0 && (
									<Badge circle size='xs' color='red'>
										{pendingList.length}
									</Badge>
								)
							}
						>
							Pending Withdrawals
						</Tabs.Tab>
						<Tabs.Tab value='history'>Live Transactions Feed</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='pending'>
						<ScrollArea h={600}>
							<Table verticalSpacing='sm' striped highlightOnHover>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Time</Table.Th>
										<Table.Th>User</Table.Th>
										<Table.Th>Amount</Table.Th>
										<Table.Th>Destination</Table.Th>
										<Table.Th>Actions</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{pendingList.length > 0 ? (
										pendingRows
									) : (
										<Table.Tr>
											<Table.Td colSpan={5} align='center' c='dimmed' py='xl'>
												No pending withdrawals found
											</Table.Td>
										</Table.Tr>
									)}
								</Table.Tbody>
							</Table>
						</ScrollArea>
					</Tabs.Panel>

					<Tabs.Panel value='history'>
						<ScrollArea h={600} type='always'>
							<Table stickyHeader verticalSpacing='xs'>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Time</Table.Th>
										<Table.Th>User</Table.Th>
										<Table.Th>Type</Table.Th>
										<Table.Th>Amount</Table.Th>
										<Table.Th>Details</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{historyRows}</Table.Tbody>
							</Table>
						</ScrollArea>
					</Tabs.Panel>
				</Tabs>
			</Paper>

			{/* Modal for Approving */}
			<Modal opened={opened} onClose={close} title='Confirm Manual Withdrawal'>
				{selectedTx && (
					<div>
						<Text size='sm' mb='xs'>
							Transfer{' '}
							<b>
								{selectedTx.amount} {selectedTx.wallet?.currency?.symbol}
							</b>{' '}
							to:
						</Text>
						<Paper withBorder p='xs' bg='gray.0' mb='md'>
							<Text
								style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}
								size='sm'
							>
								{selectedTx.toAddress}
							</Text>
						</Paper>

						<TextInput
							label='Blockchain TX Hash'
							description='Enter the transaction hash from your wallet/exchange'
							placeholder='0x...'
							value={txHash}
							onChange={(e) => setTxHash(e.currentTarget.value)}
							data-autofocus
						/>

						<Group justify='flex-end' mt='xl'>
							<Button variant='default' onClick={close}>
								Cancel
							</Button>
							<Button
								color='green'
								onClick={handleApprove}
								disabled={!txHash || txHash.length < 5}
							>
								Confirm Completed
							</Button>
						</Group>
					</div>
				)}
			</Modal>
		</Container>
	);
}
