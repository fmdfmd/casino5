import { RootState } from '@/shared/lib/redux/store';
import { createSelector } from '@reduxjs/toolkit';
import { OpenChatTypeEnum } from './slice';

export const selectSupportChatState = (state: RootState) => state.supportChat;

export const selectOpenChatType = (state: RootState) =>
	selectSupportChatState(state).openChatType;

export const makeSelectIsOpenChatType = () =>
	createSelector(
		[selectOpenChatType, (_: RootState, type: OpenChatTypeEnum) => type],
		(openChatType, type) => openChatType === type
	);

export const selectIsOpenChatTypeNull = createSelector(
	[selectOpenChatType],
	(openChatType) => openChatType === null
);
