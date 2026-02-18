'use client';
import Image from 'next/image';
import { useAppDispatch } from '@/shared/lib/redux/hooks';
import { OpenChatTypeEnum, setOpenChatType } from '@/widgets/chat/model/slice';
import { Box, Button } from '@mantine/core';
import styles from './style.module.scss';

interface ChatActionsProps {}

const ChatActions = (props: ChatActionsProps) => {
	const appDispatch = useAppDispatch();

	return (
		<Box className={styles.chatActions}>
			<Button
				onClick={() => appDispatch(setOpenChatType(OpenChatTypeEnum.PUBLIC))}
			>
				<Image
					src={'/public-chat-icon.svg'}
					width={38}
					height={38}
					alt='chat'
				/>
			</Button>
			<Button
				onClick={() => appDispatch(setOpenChatType(OpenChatTypeEnum.SUPPORT))}
			>
				<Image
					src={'/support-chat-icon.svg'}
					width={38}
					height={38}
					alt='chat support'
				/>
			</Button>
		</Box>
	);
};

export default ChatActions;
