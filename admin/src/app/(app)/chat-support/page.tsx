'use client';
import { useState, useEffect, useRef } from 'react';
import {
	Stack,
	Paper,
	Title,
	Text,
	Group,
	Button,
	TextInput,
	Badge,
	Table,
	Avatar,
	ScrollArea,
	ActionIcon,
	Box,
	Flex,
	Loader,
} from '@mantine/core';

import {
	MagnifyingGlass,
	PaperPlaneRight,
	Plus,
	X,
	Info,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import styles from './ChatSupport.module.scss'; // Твои стили
import { useSocket } from '@/shared/hooks/useSocket'; // Твой хук сокетов
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import {
	getSupportChatMessages,
	getSupportChats,
	Message,
	Session,
	setMessage,
	setMessages,
	setSession,
	setSessions,
} from '@/entities/chats/model/slice';

export default function ChatSupportPage() {
	const { socket, isConnected } = useSocket();
	const { sessions } = useAppSelector((state) => state.chat);
	const [activeChatId, setActiveChatId] = useState<string | null>('');
	const currentSession = sessions.find(
		(session) => session.id === activeChatId,
	);
	const [msgInput, setMsgInput] = useState('');
	const scrollRef = useRef<HTMLDivElement>(null);
	const { user } = useAppSelector((state) => state.user);

	const dispatch = useAppDispatch();

	const handleSelectChat = async (chatId: string) => {
		setActiveChatId(chatId);

		try {
			const res = await getSupportChatMessages(chatId);
			if (res?.data) {
				dispatch(setMessages({ messages: res.data, sessionId: chatId }));
			}
		} catch (err) {}
	};

	// 4. Отправка сообщения (как Support)
	const handleSendMessage = () => {
		if (!msgInput.trim() || !activeChatId || !socket) return;

		socket.emit('sendSupportMessageOperator', {
			chatId: activeChatId,
			content: msgInput,
		});
		setMsgInput('');
	};

	useEffect(() => {
		if (!socket) return;

		socket.emit('init');
		socket.on('supportMessage', (message) => {
			dispatch(setMessage(message));
		});
		socket.on('newSession', (session) => {
			dispatch(setSession(session));
		});
	}, [isConnected]);

	useEffect(() => {
		if (!socket) return;

		if (activeChatId || activeChatId != null || activeChatId != undefined) {
			socket.emit('joinSupportChat', { chatId: activeChatId });
		}
	}, [activeChatId]);

	const scrollToBottom = () => {
		setTimeout(() => {
			scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		const fetchSupportChats = async () => {
			const res = await getSupportChats();
			if (res?.data) {
				dispatch(setSessions(res.data));
			}
		};

		fetchSupportChats();
	}, [isConnected, user.id]);

	return (
		<Stack
			gap={{ base: 'md', md: 'xl' }}
			p={{ base: 'sm', md: 'xl' }}
			className={styles.pageWrapper}
		>
			{/* ... Блок фильтров слов (оставил без изменений) ... */}
			<Flex gap='md' direction={{ base: 'column', md: 'row' }}>
				{/* ... (твой код фильтров) ... */}
			</Flex>

			{/* 3. ЧАТ КОНТЕЙНЕР */}
			<Box className={styles.chatFlexContainer}>
				{/* --- ЛЕВО: СПИСОК ЧАТОВ --- */}
				<Box className={styles.chatSidebar}>
					<Box
						p='md'
						style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
					>
						<Text fw={700} c='white' fz='sm'>
							Active Tickets ({sessions.length})
						</Text>
					</Box>
					<ScrollArea className={styles.sidebarScroll}>
						{sessions.map((session) => {
							const lastMsg = session?.messages?.[0];
							const isActive = session.id === activeChatId;

							return (
								<Box
									key={session.id}
									className={clsx(
										styles.chatItem,
										isActive && styles.activeChatItem,
									)}
									onClick={() => handleSelectChat(session.id)}
								>
									<Group wrap='nowrap' gap='sm'>
										{/* <Avatar radius='md' color='blue' fz='xs'>
											{session.userId ? `U${session.userId}` : 'G'}
										</Avatar> */}
										<Box style={{ flex: 1, overflow: 'hidden' }}>
											{/* <Text fz='sm' fw={700} c='white'>
												{session.userId
													? `User ID: ${session.userId}`
													: `Guest: ...${session.sessionId.slice(-4)}`}
											</Text> */}
											<Text fz='xs' c='dimmed' truncate>
												{lastMsg ? lastMsg.content : 'No messages'}
											</Text>
										</Box>
										<Text fz='10px' c='dimmed' style={{ flexShrink: 0 }}>
											{lastMsg ? dayjs(lastMsg.createdAt).format('HH:mm') : ''}
										</Text>
									</Group>
								</Box>
							);
						})}
						{sessions.length === 0 && (
							<Text c='dimmed' fz='xs' ta='center' mt='md'>
								No active chats
							</Text>
						)}
					</ScrollArea>
				</Box>

				{/* --- ПРАВО: ОКНО ПЕРЕПИСКИ --- */}
				<Box className={styles.chatMain}>
					{activeChatId && currentSession ? (
						<>
							{/* Header */}
							<Group
								p='md'
								justify='space-between'
								bg='rgba(255,255,255,0.01)'
								style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
							>
								<Group gap='sm'>
									<Avatar radius='md' color='blue' size='sm'>
										{currentSession.userId ? 'U' : 'G'}
									</Avatar>
									<Box>
										<Text fz='sm' fw={700} c='white'>
											Ticket #{currentSession.id}
										</Text>
										<Text fz='10px' c='#10B981' fw={600}>
											Online
										</Text>
									</Box>
								</Group>
								<ActionIcon variant='subtle' color='gray'>
									<Info size={18} />
								</ActionIcon>
							</Group>

							{/* Messages Area */}
							<ScrollArea style={{ flex: 1 }} p={{ base: 'md', md: 'xl' }}>
								<Stack gap='lg'>
									{currentSession?.messages?.map((m) => {
										// Если пишет support -> msgOut (справа), иначе msgIn (слева)
										const isSupport = m.senderType === 'support';
										return (
											<Box
												key={m.id}
												className={isSupport ? styles.msgOut : styles.msgIn}
											>
												{m.content}
												<Text
													fz='9px'
													c='dimmed'
													ta={isSupport ? 'right' : 'left'}
													mt={4}
												>
													{dayjs(m.createdAt).format('HH:mm')}
												</Text>
											</Box>
										);
									})}
									{/* <div ref={scrollRef} /> */}
								</Stack>
							</ScrollArea>

							{/* Input Area */}
							<Box p='md' bg='rgba(0,0,0,0.1)'>
								<Group gap='xs' wrap='nowrap'>
									<ActionIcon
										variant='transparent'
										color='gray'
										size='lg'
										style={{ flexShrink: 0 }}
									>
										<Plus size={20} />
									</ActionIcon>
									<TextInput
										placeholder='Type reply...'
										className={styles.darkInput}
										style={{ flex: 1 }}
										value={msgInput}
										onChange={(e) => setMsgInput(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
									/>
									<ActionIcon
										size='42px'
										color='blue'
										variant='filled'
										radius='md'
										onClick={handleSendMessage}
										style={{ flexShrink: 0 }}
										loading={!isConnected}
									>
										<PaperPlaneRight weight='fill' size={18} />
									</ActionIcon>
								</Group>
							</Box>
						</>
					) : (
						<Flex justify='center' align='center' style={{ height: '100%' }}>
							<Text c='dimmed'>Select a ticket to start chatting</Text>
						</Flex>
					)}
				</Box>
			</Box>
		</Stack>
	);
}
