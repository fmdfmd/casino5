import { api } from '@/shared/lib/api/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export type MessageStatus = 'pending' | 'sent' | 'failed';
export type SessionType = 'pending' | 'sent' | 'failed';

export type Message = {
	id: string;
	tempId?: string;
	senderUserId: string;
	senderGuestId: string;
	type: MessageType;
	content: string;
	createdAt: string;
	editedAt: string;
	deletedAt: string;
	chatId: string;
	status?: MessageStatus;
};

export type Session = {
	id: string;
	type: SessionType;
	messages: Message[];
};

export type initialStateType = {
	sessions: Session[];
};

export const initialState: initialStateType = {
	sessions: [],
};

export const getSupportChats = async () => {
	try {
		const res = await api.get<Session[]>('chat/supportChats');
		return res;
	} catch (err) {
		console.log(err);
	}
};

export const getSupportChatMessages = async (chatId: string) => {
	try {
		const res = await api.get<Message[]>(
			`chat/supportChatMessages?chatId=${chatId}`,
		);
		return res;
	} catch (err) {
		console.log(err);
	}
};

export const chatsSlice = createSlice({
	name: 'chatSlice',
	initialState,
	reducers: {
		setSessions: (state, action: PayloadAction<Session[]>) => {
			state.sessions = action.payload;
		},
		setSession: (state, payload: PayloadAction<Session>) => {
			state.sessions.push(payload.payload);
		},

		setMessages: (
			state,
			action: PayloadAction<{ sessionId: string; messages: Message[] }>,
		) => {
			const { sessionId, messages } = action.payload;

			const session = state.sessions.find((s) => s.id === sessionId);

			if (!session) return;

			session.messages = messages.map((m) => ({
				...m,
				status: 'sent',
			}));
		},

		setMessage: (state, action: PayloadAction<Message>) => {
			const message = action.payload;

			const session = state.sessions.find((s) => s.id === message.chatId);

			if (!session) return;

			// 1️⃣ Если это подтверждение optimistic-сообщения
			if (message.tempId) {
				const index = session.messages.findIndex(
					(m) => m.tempId === message.tempId,
				);

				if (index !== -1) {
					session.messages[index] = {
						...message,
						status: 'sent',
					};
					return;
				}
			}

			// 2️⃣ Новое сообщение (от другого пользователя)
			session.messages.push({
				...message,
				status: 'sent',
			});
		},
	},
});

export const { setSession, setSessions, setMessage, setMessages } =
	chatsSlice.actions;

export default chatsSlice.reducer;
