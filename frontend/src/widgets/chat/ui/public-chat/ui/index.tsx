// 'use client';

// import {
// 	Box,
// 	Flex,
// 	Group,
// 	Select,
// 	SelectProps,
// 	Title,
// 	Text,
// 	Button,
// 	TextInput,
// } from '@mantine/core';
// import Image from 'next/image';
// import styles from './style.module.scss';
// import { useState, useEffect, useRef, useId } from 'react';
// import { useSocket } from '@/shared/hooks/useSocket';
// import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
// import { RootState } from '@/shared/lib/redux/store';
// import {
// 	confirmMessage,
// 	failMessage,
// 	getAllMessage,
// 	optimisticAddMessage,
// 	setMessage,
// 	setMessages,
// 	setOpenChatType,
// } from '@/widgets/chat/model/slice';
// import { api } from '@/shared/lib/api/axios';

// // Данные селекта
// const languages = [
// 	{ value: 'pt', label: 'Portuguese', icon: '/Flag_of_Portugal.png' },
// 	{ value: 'es', label: 'Spanish', icon: '/Flag_of_Spain.png' },
// 	{ value: 'us', label: 'English', icon: '/Flag_of_the_United_States.png' },
// ];

// // Опции (кастомный рендер с иконкой)
// const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
// 	const lang = languages.find((l) => l.value === option.value);

// 	return (
// 		<Group gap='xs'>
// 			<Image
// 				src={lang?.icon || ''}
// 				alt={lang?.label || 'flag'}
// 				width={28}
// 				height={20}
// 			/>
// 		</Group>
// 	);
// };

// interface Message {
// 	id: string;
// 	content: string;
// 	senderId: string;
// 	sender?: { name: string };
// 	createdAt: string;
// }

// const PublicChat = () => {
// 	const [currentLang, setCurrentLang] = useState('us');
// 	const messages = useAppSelector((state) => state.supportChat.messages);
// 	const [inputValue, setInputValue] = useState('');
// 	const messagesEndRef = useRef<HTMLDivElement>(null);
// 	const { socket, isConnected } = useSocket();
// 	const dispatch = useAppDispatch();
// 	const user = useAppSelector((state) => state.user.user);
// 	const isAuthenticated = !!user?.id;
// 	const selected = languages.find((l) => l.value === currentLang);
// 	const [chatId, setChatId] = useState<string | null>(null);

// 	useEffect(() => {
// 		const fetchMessage = async () => {
// 			try {
// 				const messages = await getAllMessage(chatId);

// 				dispatch(setMessages(messages));
// 			} catch (err) {
// 				console.log(err);
// 			}
// 		};
// 		if (chatId) {
// 			fetchMessage();
// 		}
// 	}, [isConnected, chatId]);

// 	useEffect(() => {
// 		if (!socket || !isAuthenticated) return;

// 		socket.emit(
// 			'joinPublicChat',
// 			{},
// 			(res: { success: boolean; data: { chatId: string } }) => {
// 				setChatId(res.data.chatId);
// 			},
// 		);

// 		socket.on('chatMigrated', ({ chatId: newChatId }: { chatId: string }) => {
// 			setChatId(newChatId);
// 		});

// 		socket.on('publicMessage', (msg) => {
// 			dispatch(setMessage(msg));
// 		});

// 		socket.on('publicMessage:confirm', (msg) => {
// 			dispatch(confirmMessage({ tempId: msg.tempId, serverMessage: msg }));
// 		});

// 		return () => {
// 			socket.off('publicMessage');
// 			socket.off('publicMessage:confirm');
// 			socket.off('chatMigrated');
// 		};
// 	}, [socket, isAuthenticated, dispatch]);

// 	useEffect(() => {
// 		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// 	}, [messages]);

// 	const handleSendMessage = () => {
// 		if (!inputValue.trim() || !socket || !isAuthenticated) return;

// 		const action = dispatch(
// 			optimisticAddMessage(inputValue, 'public', user.id),
// 		);

// 		const tempId = action.payload.tempId;

// 		socket.emit(
// 			'sendPublicMessage',
// 			{ content: inputValue, tempId, chatId },
// 			(response: { success: boolean; data?: Message }) => {
// 				if (response.success) {
// 					dispatch(
// 						confirmMessage({
// 							tempId,
// 							serverMessage: response.data!,
// 						}),
// 					);
// 				} else {
// 					dispatch(failMessage({ tempId }));
// 				}
// 			},
// 		);

// 		setInputValue('');
// 	};

// 	if (!isAuthenticated) {
// 		return (
// 			<Box className={styles.publicChat}>
// 				<Flex justify='center' align='center' direction='column' h='100%'>
// 					<Text className={styles.publicChatAuthPrompt}>
// 						Please log in to join the public chat.
// 					</Text>
// 					<Button onClick={() => dispatch(setOpenChatType(null))}>Close</Button>
// 				</Flex>
// 			</Box>
// 		);
// 	}

// 	return (
// 		<Box className={styles.publicChat}>
// 			<Flex className={styles.publicChatHeader} justify={'space-between'}>
// 				<Flex gap={10} className={styles.publicChatHeaderLeft}>
// 					<Image
// 						src={'/test-img-public-chat.jpg'}
// 						alt='test img'
// 						width={80}
// 						height={80}
// 						className={styles['test-img']}
// 						style={{ height: 80, width: 80 }}
// 					/>
// 					<Title fz={18} fw={500} className={styles.publicChatUserName}>
// 						Public Chat
// 					</Title>
// 				</Flex>

// 				{/* --- LANGUAGE SELECT --- */}
// 				<Flex className={styles.publicChatHeaderRight}>
// 					<Select
// 						classNames={{ input: styles.publicChatLanguage }}
// 						data={languages.map((l) => ({ value: l.value, label: l.label }))}
// 						renderOption={renderSelectOption}
// 						value={currentLang}
// 						leftSectionPointerEvents='none'
// 						onChange={setCurrentLang}
// 						leftSection={
// 							selected && (
// 								<Image
// 									src={selected.icon}
// 									alt={selected.label}
// 									width={40}
// 									height={28}
// 								/>
// 							)
// 						}
// 					/>
// 				</Flex>
// 			</Flex>

// 			<Box className={styles.publicChatMessages}>
// 				{!isConnected ? (
// 					<Text color='white' ta='center'>
// 						Connecting...
// 					</Text>
// 				) : messages.length === 0 ? (
// 					<Text color='white' ta='center'>
// 						No messages yet. Start the conversation!
// 					</Text>
// 				) : (
// 					messages.map((msg) => {
// 						return (
// 							<Flex
// 								key={msg.id || msg.tempId}
// 								className={`${styles.publicChatMessage} ${
// 									msg.senderUserId === user.id
// 										? styles.publicChatMessageUser
// 										: ''
// 								}`}
// 								style={{
// 									opacity: msg.status === 'pending' ? 0.6 : 1,
// 								}}
// 							>
// 								<Box>
// 									<Text className={styles.publicChatMessageSender}>
// 										{msg.senderUser?.firstName || 'Anonymous'}
// 										{msg.status === 'failed' && (
// 											<Text span color='red' ml={6}>
// 												(failed)
// 											</Text>
// 										)}
// 									</Text>
// 									<Text className={styles.publicChatMessageContent}>
// 										{msg.content}
// 									</Text>
// 								</Box>
// 							</Flex>
// 						);
// 					})
// 				)}
// 				<div ref={messagesEndRef} />
// 			</Box>

// 			<Flex className={styles.publicChatInputWrapper}>
// 				<TextInput
// 					className={styles.publicChatInput}
// 					placeholder='Type a message...'
// 					value={inputValue}
// 					onChange={(e) => setInputValue(e.target.value)}
// 					onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// 				/>
// 				<Button
// 					className={styles.publicChatSendButton}
// 					onClick={handleSendMessage}
// 				>
// 					Send
// 				</Button>
// 			</Flex>
// 		</Box>
// 	);
// };

// export default PublicChat;

'use client';

import {
	Box,
	Flex,
	Group,
	Select,
	SelectProps,
	Title,
	Text,
	TextInput,
	ActionIcon,
	Loader,
} from '@mantine/core';
import Image from 'next/image';
import styles from './style.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import {
	confirmMessage,
	failMessage,
	getAllMessage,
	optimisticAddMessage,
	setMessage,
	setMessages,
	setOpenChatType,
} from '@/widgets/chat/model/slice';
// Импортируем иконки (Mantine использует Tabler Icons по умолчанию, либо SVG)
import { IconSend, IconX } from '@tabler/icons-react';

const languages = [
	{ value: 'pt', label: 'Portuguese', icon: '/Flag_of_Portugal.png' },
	{ value: 'es', label: 'Spanish', icon: '/Flag_of_Spain.png' },
	{ value: 'us', label: 'English', icon: '/Flag_of_the_United_States.png' },
];

const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
	const lang = languages.find((l) => l.value === option.value);
	return (
		<Group gap='xs'>
			<Image
				src={lang?.icon || ''}
				alt={lang?.label || 'flag'}
				width={24}
				height={18}
				style={{ borderRadius: 2 }}
			/>
		</Group>
	);
};

interface Message {
	id: string;
	content: string;
	senderId: string;
	sender?: { name: string };
	createdAt: string;
}

const PublicChat = () => {
	const [currentLang, setCurrentLang] = useState('us');
	const messages = useAppSelector((state) => state.supportChat.messages);
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { socket, isConnected } = useSocket();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user.user);
	const isAuthenticated = !!user?.id;
	const selected = languages.find((l) => l.value === currentLang);
	const [chatId, setChatId] = useState<string | null>(null);

	// --- LOGIC START ---
	useEffect(() => {
		const fetchMessage = async () => {
			try {
				const messages = await getAllMessage(chatId);
				dispatch(setMessages(messages));
			} catch (err) {
				console.log(err);
			}
		};
		if (chatId) {
			fetchMessage();
		}
	}, [isConnected, chatId]);

	useEffect(() => {
		if (!socket || !isAuthenticated) return;

		socket.emit(
			'joinPublicChat',
			{},
			(res: { success: boolean; data: { chatId: string } }) => {
				setChatId(res.data.chatId);
			},
		);

		socket.on('chatMigrated', ({ chatId: newChatId }: { chatId: string }) => {
			setChatId(newChatId);
		});

		socket.on('publicMessage', (msg) => {
			dispatch(setMessage(msg));
		});

		socket.on('publicMessage:confirm', (msg) => {
			dispatch(confirmMessage({ tempId: msg.tempId, serverMessage: msg }));
		});

		return () => {
			socket.off('publicMessage');
			socket.off('publicMessage:confirm');
			socket.off('chatMigrated');
		};
	}, [socket, isAuthenticated, dispatch]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSendMessage = () => {
		if (!inputValue.trim() || !socket || !isAuthenticated) return;

		const action = dispatch(
			optimisticAddMessage(inputValue, 'public', user.id),
		);
		const tempId = action.payload.tempId;

		socket.emit(
			'sendPublicMessage',
			{ content: inputValue, tempId, chatId },
			(response: { success: boolean; data?: Message }) => {
				if (response.success) {
					dispatch(
						confirmMessage({
							tempId,
							serverMessage: response.data!,
						}),
					);
				} else {
					dispatch(failMessage({ tempId }));
				}
			},
		);
		setInputValue('');
	};
	// --- LOGIC END ---

	// Компонент закрытия
	const CloseButton = () => (
		<ActionIcon
			variant='transparent'
			className={styles.closeButton}
			onClick={() => dispatch(setOpenChatType(null))}
		>
			<IconX size={22} stroke={2} />
		</ActionIcon>
	);

	if (!isAuthenticated) {
		return (
			<Box className={styles.publicChat}>
				<Flex justify='flex-end' p='md'>
					<CloseButton />
				</Flex>
				<Flex justify='center' align='center' direction='column' h='100%'>
					<Text className={styles.publicChatAuthPrompt}>
						Please log in to join the public chat.
					</Text>
				</Flex>
			</Box>
		);
	}

	return (
		<Box className={styles.publicChat}>
			{/* HEADER */}
			<Flex
				className={styles.publicChatHeader}
				justify={'space-between'}
				align='center'
			>
				<Flex gap={12} align='center'>
					<Image
						src={'/test-img-public-chat.jpg'}
						alt='test img'
						width={44}
						height={44}
						className={styles.headerAvatar}
					/>
					<Box>
						<Title fz={16} fw={600} className={styles.publicChatUserName}>
							Public Chat
						</Title>
						<Text fz={12} className={styles.statusText}>
							{isConnected ? (
								<span style={{ color: '#4ADE80' }}>● Online</span>
							) : (
								<span style={{ color: '#FCD34D' }}>Connecting...</span>
							)}
						</Text>
					</Box>
				</Flex>

				<Flex align='center' gap={4}>
					<Select
						classNames={{ input: styles.publicChatLanguage }}
						data={languages.map((l) => ({ value: l.value, label: l.label }))}
						renderOption={renderSelectOption}
						value={currentLang}
						onChange={setCurrentLang}
						allowDeselect={false}
						rightSection={null}
						withCheckIcon={false}
						w={40}
						leftSection={
							selected && (
								<Image
									src={selected.icon}
									alt={selected.label}
									width={28}
									height={20}
									style={{ borderRadius: 2, cursor: 'pointer' }}
								/>
							)
						}
					/>
					<CloseButton />
				</Flex>
			</Flex>

			{/* MESSAGES */}
			<Box className={styles.publicChatMessages}>
				{!isConnected ? (
					<Flex
						justify='center'
						align='center'
						h='100%'
						direction='column'
						gap={10}
					>
						<Loader color='#C7F5FC' size='sm' />
						<Text c='#C7F5FC' size='sm'>
							Connecting...
						</Text>
					</Flex>
				) : messages.length === 0 ? (
					<Flex justify='center' align='center' h='100%' px='xl'>
						<Text
							c='dimmed'
							ta='center'
							size='sm'
							style={{ color: 'rgba(255,255,255,0.5)' }}
						>
							No messages yet. <br />
							Be the first to say hello!
						</Text>
					</Flex>
				) : (
					messages.map((msg) => {
						const isMe = msg.senderUserId === user.id;
						return (
							<Flex
								key={msg.id || msg.tempId}
								className={`${styles.publicChatMessage} ${
									isMe ? styles.publicChatMessageUser : ''
								}`}
								style={{
									opacity: msg.status === 'pending' ? 0.6 : 1,
								}}
							>
								{/* Аватарка собеседника (если не я) */}
								{!isMe && (
									<div className={styles.avatarPlaceholder}>
										{msg.senderUser?.firstName?.[0] || '?'}
									</div>
								)}

								<Box>
									{!isMe && (
										<Text className={styles.publicChatMessageSender}>
											{msg.senderUser?.firstName || 'Anonymous'}
										</Text>
									)}
									<Box
										className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleOther}`}
									>
										<Text className={styles.publicChatMessageContent}>
											{msg.content}
										</Text>
										{msg.status === 'failed' && (
											<Text size='xs' c='red' mt={2}>
												Failed
											</Text>
										)}
									</Box>
									<Text className={styles.timeStr}>
										{new Date(msg.createdAt || Date.now()).toLocaleTimeString(
											[],
											{ hour: '2-digit', minute: '2-digit' },
										)}
									</Text>
								</Box>
							</Flex>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</Box>

			{/* INPUT AREA */}
			<Box className={styles.publicChatInputContainer}>
				<Flex className={styles.publicChatInputWrapper} align='center'>
					<TextInput
						variant='unstyled'
						className={styles.publicChatInput}
						placeholder='Type a message...'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
					/>
					<ActionIcon
						className={styles.publicChatSendButton}
						onClick={handleSendMessage}
						disabled={!inputValue.trim()}
						size='lg'
						radius='xl'
					>
						<IconSend size={18} />
					</ActionIcon>
				</Flex>
			</Box>
		</Box>
	);
};

export default PublicChat;
