'use client';

import { useState } from 'react';
import Image from 'next/image';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import PartnersNavigation from '@/components/PartnersNavigation/PartnersNavigation';
import styles from './page.module.scss';

export default function PartnersPage() {
	const applyText = 'Apply for the Partnership Program';
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const faqData = [
		{
			id: '01',
			question: 'What is an affiliate program?',
			answer:
				'The affiliate program allows individuals, companies and influencers to earn commissions by bringing new players to the platform',
		},
		{
			id: '02',
			question: 'Who can become a member of the affiliate program?',
			answer:
				'Anyone who has a source of traffic: website owners, bloggers, streamers, or even social media active users.',
		},
		{
			id: '03',
			question: 'How to join the affiliate program?',
			answer:
				"Click on the 'Apply' button, fill out the simple registration form, and wait for account approval.",
		},
		{
			id: '04',
			question: 'What are the benefits of an affiliate program?',
			answer:
				'You get high conversion rates, lifetime commissions, and detailed real-time statistics.',
		},
	];

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					{/* Hero Section */}
					<section className={styles.hero}>
						<div className={styles.heroTextContainer}>
							<PartnersNavigation />

							<p className={styles.pageSubtitle}>Partnership Program</p>
							<h1 className={styles.mainTitle}>
								INVITE YOUR FRIENDS AND EARN WITH <br /> OUR AFFILIATE PROGRAM
							</h1>
							<p className={styles.heroSub}>
								Receive commission on all bets placed by your referrals at
								casinos
							</p>

							<div className={styles.statsCards}>
								<div className={`${styles.statCard} ${styles.green}`}>
									<div className={styles.statInfo}>
										<h3>24.9M</h3>
										<p>number of clients from all over the world</p>
									</div>
									<Image
										src='/globe1.svg'
										alt='globe'
										width={110}
										height={110}
										className={styles.statIcon}
									/>
								</div>
								<div className={`${styles.statCard} ${styles.orange}`}>
									<div className={styles.statInfo}>
										<h3>33</h3>
										<p>number of payment methods</p>
									</div>
									<Image
										src='/payment.svg'
										alt='payment'
										width={110}
										height={110}
										className={styles.statIcon}
									/>
								</div>
								<div className={`${styles.statCard} ${styles.blue}`}>
									<div className={styles.statInfo}>
										<h3>16</h3>
										<p>number of languages supported</p>
									</div>
									<Image
										src='/star.svg'
										alt='star'
										width={110}
										height={110}
										className={styles.statIcon}
									/>
								</div>
							</div>
						</div>

						<div className={styles.heroImageWrapper}>
							<Image
								src='/1 267510.svg'
								alt='Money Bag'
								width={487}
								height={508}
								priority
								className={styles.moneyBag}
							/>
						</div>
					</section>

					{/* Steps Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Partnering with us is easy</h2>
						<div className={styles.stepsGrid}>
							<div className={styles.step}>
								<span className={styles.stepNum}>Step 1</span>
								<div className={styles.stepIcon}>
									<Image
										src='/step1.svg'
										alt='Create'
										width={100}
										height={100}
									/>
								</div>
								<h3>Create your referral campaign.</h3>
							</div>
							<div className={styles.step}>
								<span className={styles.stepNum}>Step 2</span>
								<div className={styles.stepIcon}>
									<Image
										src='/step2.svg'
										alt='Share'
										width={100}
										height={100}
									/>
								</div>
								<h3>Share your referral link.</h3>
							</div>
							<div className={styles.step}>
								<span className={styles.stepNum}>Step 3</span>
								<div className={styles.stepIcon}>
									<Image src='/step3.svg' alt='Earn' width={100} height={100} />
								</div>
								<h3>Earn and withdraw commissions.</h3>
							</div>
						</div>
					</section>

					{/* CTA Banner */}
					<div className={styles.ctaBanner}>
						<div className={styles.ctaInfo}>
							<Image src='/case.svg' alt='case' width={44} height={44} />
							<p>
								Do you have many subscribers...? <br />
								<span>
									You could earn a higher commission thanks to personalized
									terms.
								</span>
							</p>
						</div>
						<button className={styles.loginBtn}>Log in/Sign up</button>
					</div>

					{/* Exclusive Benefits */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Exclusive benefits</h2>
						<div className={styles.benefitsGrid}>
							{[
								{
									title: 'Instant paymentsTable',
									desc: 'No need to wait. Profits will be credited to your account instantly.',
									icon: 'benefit1',
								},
								{
									title: 'Highest player profitability',
									desc: 'Earn more by recommending the service with the most attractive rates.',
									icon: 'benefit2',
								},
								{
									title: 'Cryptocurrencies',
									desc: 'Earn the way you want - we support both cryptocurrencies and standard.',
									icon: 'benefit3',
								},
								{
									title: 'Unlimited commission',
									desc: 'You earn every time your referrals play.',
									icon: 'benefit4',
								},
								{
									title: 'Individual commissions',
									desc: 'Customize your commission plan to suit your business needs.',
									icon: 'benefit5',
								},
								{
									title: 'Multilingual support 24/7',
									desc: 'Our team is available to support you in your language.',
									icon: 'benefit6',
								},
							].map((item, idx) => (
								<div key={idx} className={styles.benefitItem}>
									<Image
										src={`/${item.icon}.svg`}
										alt={item.title}
										width={48}
										height={48}
									/>
									<div className={styles.benefitText}>
										<h4>{item.title}</h4>
										<p>{item.desc}</p>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* FAQ Section */}
					<section className={styles.faqSection}>
						<h2 className={styles.faqMainTitle}>FAQ</h2>
						<div className={styles.faqList}>
							{faqData.map((item, index) => (
								<div
									key={index}
									className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
								>
									<div
										className={styles.faqHeader}
										onClick={() => toggleFAQ(index)}
									>
										<h3 className={styles.faqQuestionText}>{item.question}</h3>
										<span className={styles.faqToggleIcon}>+</span>
									</div>
									<div className={styles.faqContentWrapper}>
										<div className={styles.faqAnswerText}>{item.answer}</div>
									</div>
								</div>
							))}
						</div>
					</section>

					<button className={styles.bigLoginBtn}>{applyText}</button>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
