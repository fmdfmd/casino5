import styles from './footer.module.scss';
import { Flex, Text } from '@mantine/core';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<Text fz='xs' c='dimmed'>
					© 2025 WinVibe all rights reserved
				</Text>
				<Flex gap='md' align='center'>
					<Text
						fz='xs'
						c='dimmed'
						component='a'
						href='#'
						style={{ textDecoration: 'none' }}
					>
						Privacy Policy
					</Text>
					<span className={styles.dot}>•</span>
					<Text
						fz='xs'
						c='dimmed'
						component='a'
						href='#'
						style={{ textDecoration: 'none' }}
					>
						Terms Of Service
					</Text>
				</Flex>
			</div>
		</footer>
	);
};

export default Footer;
