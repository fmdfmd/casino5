import { api } from '@/shared/lib/api/axios';
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export type MessageStatus = 'pending' | 'sent' | 'failed';

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

export enum OpenChatTypeEnum {
	PUBLIC = 'public',
	SUPPORT = 'support',
}

type initialStateType = {
	id: string | null;
	openChatType: OpenChatTypeEnum | null;
	messages: Message[];
};

const initialState: initialStateType = {
	id: null,
	openChatType: null,
	messages: [],
};

export const getAllMessage = async (chatId?: string) => {
	try {
		const res = await api.get(`/chat/myMessages?chatId=${chatId}`);
		return res.data;
	} catch (err) {
		console.error('Ошибка при получении сообщений:', err);
		return [];
	}
};

export const getSupportMessages = async (chatId: string | null) => {
	try {
		const res = await api.get<Message[]>(
			`/chat/mySupportMessages?chatId=${chatId}`,
		);
		return res.data;
	} catch (err) {
		console.error('Ошибка при получении сообщений:', err);
		return [];
	}
};

export const supportChatSlice = createSlice({
	name: 'supportChatSlice',
	initialState,
	reducers: {
		setMessages: (state, action: PayloadAction<Message[]>) => {
			state.messages = action.payload;
		},

		setMessage: (state, action: PayloadAction<Message>) => {
			state.messages.push(action.payload);
		},

		setOpenChatType: (
			state,
			action: PayloadAction<OpenChatTypeEnum | null>,
		) => {
			state.openChatType = action.payload;
		},

		optimisticAddMessage: {
			reducer(state, action: PayloadAction<Message>) {
				state.messages.push(action.payload);
			},
			prepare(content: string, chatId: string, senderUserId: string) {
				return {
					payload: {
						id: '',
						tempId: nanoid(),
						senderUserId,
						senderGuestId: '',
						type: 'text',
						content,
						createdAt: new Date().toISOString(),
						editedAt: '',
						deletedAt: '',
						chatId,
						status: 'pending',
					} as Message,
				};
			},
		},

		confirmMessage(
			state,
			action: PayloadAction<{ tempId: string; serverMessage: Message }>,
		) {
			const index = state.messages.findIndex(
				(m) => m.tempId === action.payload.tempId,
			);
			if (index !== -1) {
				state.messages[index] = {
					...action.payload.serverMessage,
					status: 'sent',
				};
			}
		},

		failMessage(state, action: PayloadAction<{ tempId: string }>) {
			const msg = state.messages.find(
				(m) => m.tempId === action.payload.tempId,
			);
			if (msg) msg.status = 'failed';
		},
	},
});

export const {
	setOpenChatType,
	optimisticAddMessage,
	confirmMessage,
	failMessage,
	setMessage,
	setMessages,
} = supportChatSlice.actions;

export const supportChatReducer = supportChatSlice.reducer;
