'use client';
import Image from 'next/image';
import styles from './ExitModal.module.scss';

interface ExitModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ExitModal({
	isOpen,
	onClose,
	onConfirm,
}: ExitModalProps) {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<div className={styles.exitTitle}>
						<Image src='/exit-door.svg' alt='Exit' width={25} height={25} />
						<span>Exit</span>
					</div>
					<button className={styles.closeBtn} onClick={onClose}>
						<Image src='/close.svg' alt='Close' width={25} height={25} />
					</button>
				</div>

				<div className={styles.content}>
					<p className={styles.question}>Do you really want out?</p>
				</div>

				<div className={styles.actions}>
					<button className={styles.btnStay} onClick={onClose}>
						Stay
					</button>
					<button className={styles.btnExit} onClick={onConfirm}>
						Get out
					</button>
				</div>
			</div>
		</div>
	);
}
