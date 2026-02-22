'use client';

import {
	getSupportMessages,
	setMessage,
	setMessages,
	setOpenChatType,
} from '@/widgets/chat/model/slice';
import {
	Box,
	Title,
	ActionIcon,
	Text,
	Button,
	TextInput,
	Flex,
	Loader,
} from '@mantine/core';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IconSend, IconX, IconHelpCircle } from '@tabler/icons-react'; // Используем современные иконки

import styles from './style.module.scss';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';

const faqQuestions = [
	{
		question: 'Reset password?',
		autoResponse:
			'To reset your password, go to the login page and click "Forgot Password".',
	},
	{
		question: 'Refund policy?',
		autoResponse: 'We offer full refunds within 30 days of purchase.',
	},
	{
		question: 'Contact billing?',
		autoResponse: 'For billing issues, email billing@yourapp.com.',
	},
];

const SupportChat = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.user);
	const { socket, isConnected } = useSocket();

	// Guest ID logic
	const [guestId] = useState(() => {
		if (typeof window !== 'undefined') {
			let id = localStorage.getItem('supportGuestId');
			if (!id) {
				id = uuidv4();
				localStorage.setItem('supportGuestId', id);
			}
			return id;
		}
		return '';
	});

	const [chatId, setChatId] = useState<string | null>(null);
	const { messages } = useAppSelector((state) => state.supportChat);
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = (textOverride?: string) => {
		const text = textOverride || inputValue;
		if (!text.trim() || !socket) return;

		socket.emit('sendSupportMessage', {
			chatId,
			content: text,
			senderType: user?.roles?.[0] || 'guest',
		});

		if (!textOverride) setInputValue('');
	};

	// --- Socket Logic ---
	useEffect(() => {
		if (!socket) return;

		const handleMessage = (message: any) => {
			dispatch(setMessage(message));
		};

		const handleChatId = (id: string) => {
			setChatId(id);
			localStorage.setItem('chatId', id);
		};

		socket.on('supportMessage', handleMessage);
		socket.on('supportChatId', handleChatId);

		// Join logic
		const storedChatId = localStorage.getItem('chatId');
		if (storedChatId) {
			setChatId(storedChatId);
			socket.emit('joinSupportChat', { chatId: storedChatId });
		} else {
			// Если чата нет, можно эмитить join без ID, чтобы сервер создал новый
			// или ждать первого сообщения. Зависит от бекенда.
			// socket.emit('joinSupportChat', {});
		}

		return () => {
			socket.off('supportMessage', handleMessage);
			socket.off('supportChatId', handleChatId);
		};
	}, [isConnected, socket, dispatch]);

	useEffect(() => {
		const fetchSupportMessages = async () => {
			if (chatId) {
				try {
					const res = await getSupportMessages(chatId);
					dispatch(setMessages(res));
				} catch (e) {
					console.error(e);
				}
			}
		};
		fetchSupportMessages();
	}, [chatId, isConnected, dispatch]);

	return (
		<Box className={styles.supportChat}>
			{/* HEADER */}
			<Flex
				className={styles.supportChatHeader}
				justify='space-between'
				align='center'
			>
				<Flex align='center' gap={12}>
					<Box className={styles.avatarContainer}>
						<Image
							src={'/assets/icons/support-chat-person.svg'}
							alt='Support'
							width={24}
							height={24}
						/>
					</Box>
					<Box>
						<Title className={styles.supportChatTitle}>Support</Title>
						<Flex align='center' gap={6}>
							<Box
								className={styles.statusDot}
								style={{ background: isConnected ? '#48BB78' : '#ECC94B' }}
							/>
							<Text className={styles.supportChatSubtitle}>
								{isConnected ? 'We are online' : 'Connecting...'}
							</Text>
						</Flex>
					</Box>
				</Flex>

				<ActionIcon
					variant='transparent'
					className={styles.closeBtn}
					onClick={() => dispatch(setOpenChatType(null))}
				>
					<IconX size={22} />
				</ActionIcon>
			</Flex>

			{/* CONTENT AREA */}
			<Box className={styles.supportChatContent}>
				{/* FAQ Section */}
				<Box className={styles.supportChatFaq}>
					<Flex align='center' gap={6} mb={8}>
						<IconHelpCircle size={14} color='rgba(255,255,255,0.7)' />
						<Text className={styles.supportChatFaqTitle}>Quick Assistant</Text>
					</Flex>
					<Flex wrap='wrap' gap={8}>
						{faqQuestions.map((faq, idx) => (
							<Button
								key={idx}
								className={styles.faqButton}
								variant='outline'
								onClick={() => handleSendMessage(faq.question)} // Предполагаем отправку вопроса
								size='xs'
								radius='xl'
								disabled={!isConnected}
							>
								{faq.question}
							</Button>
						))}
					</Flex>
				</Box>

				{/* Messages */}
				{!isConnected ? (
					<Flex justify='center' align='center' direction='column' mt={20}>
						<Loader color='#C7F5FC' size='sm' />
					</Flex>
				) : messages?.length === 0 ? (
					<Flex
						justify='center'
						align='center'
						direction='column'
						mt={40}
						px={20}
					>
						<Text
							c='dimmed'
							ta='center'
							size='sm'
							style={{ color: 'rgba(255,255,255,0.5)' }}
						>
							Hi there! 👋
							<br />
							How can we help you today?
						</Text>
					</Flex>
				) : (
					<Flex direction='column' gap={12}>
						{messages.map((msg, idx) => {
							const isMine = user?.id === msg.senderUserId;
							// Если user.id нет (гость), логику isMine нужно адаптировать под guestId,
							// если бекенд возвращает senderId равный guestId.

							return (
								<Flex
									key={msg.id || idx}
									className={`${styles.messageRow} ${isMine ? styles.messageRowMine : ''}`}
								>
									{!isMine && (
										<div className={styles.botAvatar}>
											<Image
												src='/assets/icons/support-chat-person.svg'
												alt='Bot'
												width={20}
												height={20}
											/>
										</div>
									)}

									<Box
										className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleOther}`}
									>
										<Text className={styles.messageText}>{msg.content}</Text>
									</Box>
								</Flex>
							);
						})}
						<div ref={messagesEndRef} />
					</Flex>
				)}
			</Box>

			{/* INPUT AREA */}
			<Box className={styles.inputContainer}>
				<Flex className={styles.inputWrapper} align='center'>
					<TextInput
						variant='unstyled'
						className={styles.textInput}
						placeholder='Type your message...'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
						disabled={!isConnected}
					/>
					<ActionIcon
						className={styles.sendButton}
						onClick={() => handleSendMessage()}
						disabled={!inputValue.trim() || !isConnected}
						size='lg'
					>
						<IconSend size={18} />
					</ActionIcon>
				</Flex>
			</Box>
		</Box>
	);
};

export default SupportChat;
