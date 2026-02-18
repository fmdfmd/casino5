'use client';

import Footer from '@/components/footer/footer';
import HeaderUp from '@/components/HeaderUp/HeaderUp';
import SlideBar from '@/components/SlideBar/SlideBar';
import { getCurrentUser } from '@/entities/user/model/api/getCurrentUser';
import { getServerUser } from '@/entities/user/model/api/getServerUser';
import { setUser } from '@/entities/user/model/slice';
import { useAppDispatch } from '@/shared/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import styles from '../layout.module.scss';

const AppLayout = ({ children }: { children: ReactNode }) => {
	const [mobileOpened, setMobileOpened] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const isAuthPage = pathname === '/auth';

	useEffect(() => {
		if (mobileOpened) {
			setMobileOpened(false);
		}
	}, [pathname]);

	const dispatch = useAppDispatch();

	// useEffect(() => {
	// 	const getUser = async () => {
	// 		try {
	// 			const user = await getCurrentUser();
	// 			if (user) dispatch(setUser(user));
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};
	// 	getUser();
	// }, []);

	return (
		<>
			<div className={styles.layoutContainer}>
				<SlideBar
					mobileOpened={mobileOpened}
					isCollapsed={isCollapsed}
					toggleCollapse={() => {
						if (window.innerWidth <= 992) {
							setMobileOpened(!mobileOpened);
						} else {
							setIsCollapsed(!isCollapsed);
						}
					}}
				/>

				<div className={styles.mainWrapper}>
					<HeaderUp
						onBurgerClick={() => setMobileOpened(true)}
						mobileOpened={mobileOpened}
					/>

					<main className={styles.content}>{children}</main>

					<Footer />
				</div>
			</div>
		</>
	);
};

export default AppLayout;
