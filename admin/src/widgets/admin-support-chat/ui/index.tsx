// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import {
// 	Paper,
// 	Grid,
// 	TextInput,
// 	ScrollArea,
// 	Stack,
// 	Text,
// 	Avatar,
// 	Group,
// 	ActionIcon,
// 	Badge,
// 	Loader,
// 	Divider,
// } from '@mantine/core';
// import { io, Socket } from 'socket.io-client';
// import { useSocket } from '@/shared/hooks/useSocket';

// // Замените на ваш URL
// const SOCKET_URL = 'http://localhost:8000';

// interface ChatSession {
// 	id: string;
// 	guestId: string;
// 	lastMessage: string;
// 	lastMessageAt: string;
// }

// interface Message {
// 	id: number;
// 	content: string;
// 	senderId: number | null;
// 	guestId: string | null;
// 	type: 'operator' | 'guest';
// 	createdAt: string;
// }

// export default function AdminChat() {
// 	const { socket } = useSocket();
// 	const [chats, setChats] = useState<ChatSession[]>([]);
// 	const [activeChatId, setActiveChatId] = useState<string | null>(null);
// 	const [messages, setMessages] = useState<Message[]>([]);
// 	const [inputText, setInputText] = useState('');
// 	const [loading, setLoading] = useState(false);

// 	const viewport = useRef<HTMLDivElement>(null);

// 	// 1. Инициализация сокета и загрузка списка чатов
// 	useEffect(() => {
// 		console.log(socket, 'socket-1');
// 		// Слушаем новые сообщения от гостей (обновление списка)
// 		socket.on(
// 			'newGuestMessage',
// 			(payload: { chatId: string; message: any }) => {
// 				// Обновляем список чатов (поднимаем активный наверх)
// 				setChats((prev) => {
// 					const existing = prev.find((c) => c.id === payload.chatId);
// 					const updatedChat = existing
// 						? {
// 								...existing,
// 								lastMessage: payload.message.content,
// 								lastMessageAt: new Date().toISOString(),
// 						  }
// 						: {
// 								id: payload.chatId,
// 								guestId: payload.message.guestId || 'Guest',
// 								lastMessage: payload.message.content,
// 								lastMessageAt: new Date().toISOString(),
// 						  };

// 					// Фильтруем старый и добавляем новый в начало
// 					return [updatedChat, ...prev.filter((c) => c.id !== payload.chatId)];
// 				});

// 				// Если открыт этот чат, добавляем сообщение
// 				if (activeChatId === payload.chatId) {
// 					setMessages((prev) => [...prev, payload.message]);
// 					scrollToBottom();
// 				}
// 			}
// 		);

// 		// Слушаем сообщения операторов (себя или коллег) внутри чата
// 		socket.on('newSupportMessage', (message: Message) => {
// 			if (activeChatId === message.chatId) {
// 				setMessages((prev) => {
// 					// Избегаем дублей, если мы сами отправили
// 					if (prev.find((m) => m.id === message.id)) return prev;
// 					return [...prev, message];
// 				});
// 				scrollToBottom();
// 			}
// 		});

// 		// Загрузка начального списка чатов через REST API
// 		fetch(`${SOCKET_URL}/chat/admin/list`) // Ваш endpoint
// 			.then((res) => res.json())
// 			.then((data) => setChats(data))
// 			.catch((err) => console.error('Failed to load chats', err));

// 		return () => {
// 			socket.disconnect();
// 		};
// 	}, [activeChatId, socket]);

// 	// 2. Логика выбора чата
// 	const handleSelectChat = async (chatId: string) => {
// 		setActiveChatId(chatId);
// 		setLoading(true);

// 		// Загрузка истории
// 		try {
// 			const res = await fetch(`${SOCKET_URL}/chat/support-history/${chatId}`);
// 			const history = await res.json();
// 			setMessages(history);

// 			// Джойнимся в комнату чата через сокет, чтобы получать сообщения в реальном времени
// 			if (socket) {
// 				socket.emit('joinSupportChatAsAdmin', { chatId });
// 			}
// 		} catch (error) {
// 			console.error(error);
// 		} finally {
// 			setLoading(false);
// 			setTimeout(scrollToBottom, 100);
// 		}
// 	};

// 	// 3. Отправка сообщения
// 	const handleSendMessage = () => {
// 		if (!inputText.trim() || !activeChatId || !socket) return;

// 		const payload = {
// 			chatId: activeChatId,
// 			content: inputText,
// 			senderId: 1, // ВАЖНО: ID текущего админа (брать из контекста Auth)
// 			token: localStorage.getItem('accessToken'), // Для бэкенд валидации
// 		};

// 		socket.emit('sendSupportMessage', payload);
// 		setInputText('');
// 	};

// 	const scrollToBottom = () => {
// 		if (viewport.current) {
// 			viewport.current.scrollTo({
// 				top: viewport.current.scrollHeight,
// 				behavior: 'smooth',
// 			});
// 		}
// 	};

// 	return (
// 		<Grid h='calc(100vh - 100px)' gutter='0'>
// 			{/* Sidebar: Chat List */}
// 			<Grid.Col span={4} style={{ borderRight: '1px solid #eee' }}>
// 				<Paper p='md' h='100%' bg='#f8f9fa'>
// 					<Text size='lg' fw={700} mb='md'>
// 						Support Tickets
// 					</Text>
// 					<ScrollArea h='calc(100% - 60px)'>
// 						<Stack gap='xs'>
// 							{chats.map((chat) => (
// 								<Paper
// 									key={chat.id}
// 									p='sm'
// 									withBorder
// 									onClick={() => handleSelectChat(chat.id)}
// 									style={{
// 										cursor: 'pointer',
// 										borderColor:
// 											activeChatId === chat.id ? '#2A3970' : '#dee2e6',
// 										backgroundColor:
// 											activeChatId === chat.id ? '#e7f5ff' : 'white',
// 									}}
// 								>
// 									<Group justify='space-between' mb={5}>
// 										<Text fw={500} size='sm'>
// 											Guest: {chat.guestId.slice(0, 8)}...
// 										</Text>
// 										<Text size='xs' c='dimmed'>
// 											{new Date(chat.lastMessageAt).toLocaleTimeString([], {
// 												hour: '2-digit',
// 												minute: '2-digit',
// 											})}
// 										</Text>
// 									</Group>
// 									<Text size='xs' c='dimmed' lineClamp={1}>
// 										{chat.lastMessage}
// 									</Text>
// 								</Paper>
// 							))}
// 						</Stack>
// 					</ScrollArea>
// 				</Paper>
// 			</Grid.Col>

// 			{/* Main: Chat Window */}
// 			<Grid.Col span={8}>
// 				{!activeChatId ? (
// 					<Stack justify='center' align='center' h='100%' bg='#fff'>
// 						<Text c='dimmed'>Select a chat to start messaging</Text>
// 					</Stack>
// 				) : (
// 					<Stack h='100%' justify='space-between' gap={0}>
// 						{/* Header */}
// 						<Paper p='md' withBorder shadow='xs' style={{ zIndex: 10 }}>
// 							<Group>
// 								<Avatar color='blue' radius='xl'>
// 									G
// 								</Avatar>
// 								<Stack gap={0}>
// 									<Text size='sm' fw={700}>
// 										Chat ID: {activeChatId.slice(0, 8)}
// 									</Text>
// 									<Text size='xs' c='green'>
// 										Active
// 									</Text>
// 								</Stack>
// 							</Group>
// 						</Paper>

// 						{/* Messages Area */}
// 						<ScrollArea
// 							viewportRef={viewport}
// 							style={{ flex: 1 }}
// 							bg='#f1f3f5'
// 							p='md'
// 						>
// 							{loading ? (
// 								<Loader size='sm' m='auto' />
// 							) : (
// 								<Stack gap='sm'>
// 									{messages.map((msg) => {
// 										// Проверяем, кто отправитель.
// 										// Если type === 'operator', считаем что это мы (справа).
// 										// В реальном проекте сравнивать msg.senderId === myUserId
// 										const isMe = msg.type === 'operator';
// 										return (
// 											<Group
// 												key={msg.id}
// 												justify={isMe ? 'flex-end' : 'flex-start'}
// 												align='flex-end'
// 											>
// 												{!isMe && <Avatar size='sm' radius='xl' />}
// 												<Paper
// 													p='xs'
// 													radius='md'
// 													bg={isMe ? '#2A3970' : 'white'}
// 													c={isMe ? 'white' : 'black'}
// 													maw='70%'
// 													shadow='xs'
// 												>
// 													<Text size='sm'>{msg.content}</Text>
// 													<Text
// 														size='xs'
// 														c={isMe ? 'rgba(255,255,255,0.7)' : 'dimmed'}
// 														ta='right'
// 														mt={4}
// 													>
// 														{new Date(msg.createdAt).toLocaleTimeString([], {
// 															hour: '2-digit',
// 															minute: '2-digit',
// 														})}
// 													</Text>
// 												</Paper>
// 											</Group>
// 										);
// 									})}
// 								</Stack>
// 							)}
// 						</ScrollArea>

// 						{/* Input Area */}
// 						<Paper p='md' withBorder>
// 							<Group>
// 								<TextInput
// 									style={{ flex: 1 }}
// 									placeholder='Type a message...'
// 									value={inputText}
// 									onChange={(e) => setInputText(e.currentTarget.value)}
// 									onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
// 								/>
// 								<ActionIcon
// 									variant='filled'
// 									color='#2A3970'
// 									size='lg'
// 									onClick={handleSendMessage}
// 									disabled={!inputText.trim()}
// 								>
// 									<svg
// 										width='24'
// 										height='24'
// 										viewBox='0 0 24 24'
// 										fill='none'
// 										xmlns='http://www.w3.org/2000/svg'
// 									>
// 										<path
// 											d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z'
// 											fill='white'
// 										/>
// 									</svg>
// 								</ActionIcon>
// 							</Group>
// 						</Paper>
// 					</Stack>
// 				)}
// 			</Grid.Col>
// 		</Grid>
// 	);
// }

'use client';
import { useEffect, useState, useRef } from 'react';
import {
	Paper,
	Grid,
	TextInput,
	ScrollArea,
	Stack,
	Text,
	Avatar,
	Group,
	ActionIcon,
	Loader,
} from '@mantine/core';
import { BACKEND_URL, useSocket } from '@/shared/hooks/useSocket'; // Убедитесь, что путь верный

// Типы
interface ChatSession {
	id: string;
	guestId: string;
	lastMessage: string;
	lastMessageAt: string;
}

interface Message {
	id: number;
	content: string;
	senderId: number | null;
	guestId: string | null;
	type: 'operator' | 'guest';
	createdAt: string;
	chatId: string;
}

const SOCKET_URL = BACKEND_URL;

export default function AdminChat() {
	// Получаем токен (можно вынести в контекст, но пока так)
	const token =
		typeof window !== 'undefined'
			? localStorage.getItem('accessToken') || undefined
			: undefined;

	const { socket, isConnected } = useSocket(token);

	const [chats, setChats] = useState<ChatSession[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');
	const [loading, setLoading] = useState(false);

	const viewport = useRef<HTMLDivElement>(null);

	// --- Эффект 1: Глобальные подписки (список чатов) ---
	useEffect(() => {
		// ГЛАВНОЕ ИСПРАВЛЕНИЕ: Если сокет еще не создан — выходим
		if (!socket) return;

		// Слушаем новые сообщения от гостей (обновление списка слева)
		const handleNewGuestMessage = (payload: {
			chatId: string;
			message: any;
		}) => {
			setChats((prev) => {
				const existing = prev.find((c) => c.id === payload.chatId);
				const updatedChat = existing
					? {
							...existing,
							lastMessage: payload.message.content,
							lastMessageAt: new Date().toISOString(),
						}
					: {
							id: payload.chatId,
							guestId: payload.message.guestId || 'Guest',
							lastMessage: payload.message.content,
							lastMessageAt: new Date().toISOString(),
						};

				// Перемещаем обновленный чат наверх
				return [updatedChat, ...prev.filter((c) => c.id !== payload.chatId)];
			});

			// Также обновляем текущий открытый чат, если это он
			if (activeChatId === payload.chatId) {
				setMessages((prev) => [...prev, payload.message]);
				setTimeout(scrollToBottom, 50);
			}
		};

		socket.on('newGuestMessage', handleNewGuestMessage);

		// Входим в комнату админа, чтобы получать уведомления
		socket.emit('joinAdminPanel');

		// Загрузка начального списка через API
		fetch(`${SOCKET_URL}/chat/admin/list`)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) setChats(data);
			})
			.catch((err) => console.error('Failed to load chats', err));

		return () => {
			socket.off('newGuestMessage', handleNewGuestMessage);
		};
	}, [socket, activeChatId]); // Зависимость от socket обязательна

	// --- Эффект 2: Сообщения внутри открытого чата ---
	useEffect(() => {
		if (!socket || !activeChatId) return;

		const handleSupportMessage = (message: Message) => {
			// Добавляем сообщение, только если оно для ТЕКУЩЕГО чата
			if (message.chatId === activeChatId) {
				setMessages((prev) => {
					if (prev.find((m) => m.id === message.id)) return prev;
					return [...prev, message];
				});
				setTimeout(scrollToBottom, 50);
			}
		};

		socket.on('newSupportMessage', handleSupportMessage);

		// Подписываемся на конкретную комнату чата
		socket.emit('joinSupportChatAsAdmin', { chatId: activeChatId });

		return () => {
			socket.off('newSupportMessage', handleSupportMessage);
		};
	}, [socket, activeChatId]);

	// Логика UI
	const handleSelectChat = async (chatId: string) => {
		setActiveChatId(chatId);
		setLoading(true);
		try {
			const res = await fetch(`${SOCKET_URL}/chat/support-history/${chatId}`);
			const history = await res.json();
			setMessages(history);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
			setTimeout(scrollToBottom, 100);
		}
	};

	const handleSendMessage = () => {
		if (!inputText.trim() || !activeChatId || !socket) return;

		const payload = {
			chatId: activeChatId,
			content: inputText,
			senderId: null, // Тут нужен реальный ID админа
			token: token,
		};

		socket.emit('sendSupportMessage', payload);
		setInputText('');
	};

	const scrollToBottom = () => {
		viewport.current?.scrollTo({
			top: viewport.current.scrollHeight,
			behavior: 'smooth',
		});
	};

	// UI (Рендер)
	return (
		<Grid h='calc(100vh - 100px)' gutter='0'>
			{/* Sidebar */}
			<Grid.Col span={4} style={{ borderRight: '1px solid #eee' }}>
				<Paper p='md' h='100%' bg='#f8f9fa'>
					<Group justify='space-between' mb='md'>
						<Text size='lg' fw={700}>
							Support Tickets
						</Text>
						{/* Индикатор статуса сокета для отладки */}
						<div
							style={{
								width: 10,
								height: 10,
								borderRadius: '50%',
								background: isConnected ? 'green' : 'red',
							}}
						/>
					</Group>
					<ScrollArea h='calc(100% - 60px)'>
						<Stack gap='xs'>
							{chats.map((chat) => (
								<Paper
									key={chat.id}
									p='sm'
									withBorder
									onClick={() => handleSelectChat(chat.id)}
									style={{
										cursor: 'pointer',
										borderColor:
											activeChatId === chat.id ? '#2A3970' : '#dee2e6',
										backgroundColor:
											activeChatId === chat.id ? '#e7f5ff' : 'white',
									}}
								>
									<Group justify='space-between' mb={5}>
										<Text fw={500} size='sm'>
											Guest:{' '}
											{chat.guestId ? chat.guestId.slice(0, 8) : 'Unknown'}...
										</Text>
										<Text size='xs' c='dimmed'>
											{new Date(chat.lastMessageAt).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</Text>
									</Group>
									<Text size='xs' c='dimmed' lineClamp={1}>
										{chat.lastMessage}
									</Text>
								</Paper>
							))}
						</Stack>
					</ScrollArea>
				</Paper>
			</Grid.Col>

			{/* Chat Area */}
			<Grid.Col span={8}>
				{!activeChatId ? (
					<Stack justify='center' align='center' h='100%' bg='#fff'>
						<Text c='dimmed'>Select a chat to start messaging</Text>
					</Stack>
				) : (
					<Stack h='100%' justify='space-between' gap={0}>
						{/* Header */}
						<Paper p='md' withBorder shadow='xs' style={{ zIndex: 10 }}>
							<Group>
								<Avatar color='blue' radius='xl'>
									G
								</Avatar>
								<Stack gap={0}>
									<Text size='sm' fw={700}>
										Chat ID: {activeChatId.slice(0, 8)}
									</Text>
									<Text size='xs' c='green'>
										Active
									</Text>
								</Stack>
							</Group>
						</Paper>

						{/* Messages */}
						<ScrollArea
							viewportRef={viewport}
							style={{ flex: 1 }}
							bg='#f1f3f5'
							p='md'
						>
							{loading ? (
								<Loader size='sm' m='auto' />
							) : (
								<Stack gap='sm'>
									{messages.map((msg) => {
										const isMe = msg.type === 'operator';
										return (
											<Group
												key={msg.id}
												justify={isMe ? 'flex-end' : 'flex-start'}
												align='flex-end'
											>
												{!isMe && <Avatar size='sm' radius='xl' />}
												<Paper
													p='xs'
													radius='md'
													bg={isMe ? '#2A3970' : 'white'}
													c={isMe ? 'white' : 'black'}
													maw='70%'
													shadow='xs'
												>
													<Text size='sm'>{msg.content}</Text>
													<Text
														size='xs'
														c={isMe ? 'rgba(255,255,255,0.7)' : 'dimmed'}
														ta='right'
														mt={4}
													>
														{new Date(msg.createdAt).toLocaleTimeString([], {
															hour: '2-digit',
															minute: '2-digit',
														})}
													</Text>
												</Paper>
											</Group>
										);
									})}
								</Stack>
							)}
						</ScrollArea>

						{/* Input */}
						<Paper p='md' withBorder>
							<Group>
								<TextInput
									style={{ flex: 1 }}
									placeholder='Type a message...'
									value={inputText}
									onChange={(e) => setInputText(e.currentTarget.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
								/>
								<ActionIcon
									variant='filled'
									color='#2A3970'
									size='lg'
									onClick={handleSendMessage}
									disabled={!inputText.trim()}
								>
									{/* Icon SVG */}
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
										<path
											d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z'
											fill='white'
										/>
									</svg>
								</ActionIcon>
							</Group>
						</Paper>
					</Stack>
				)}
			</Grid.Col>
		</Grid>
	);
}
