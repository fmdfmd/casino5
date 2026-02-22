'use client';

import React from 'react';
import Image from 'next/image';
import styles from './VaultPage.module.scss';

// Компоненты
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

export default function VaultPage() {
	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.articleContainer}>
						{/* ЗАГОЛОВОК И МЕТА */}
						<div className={styles.headerBlock}>
							<h1 className={styles.pageTitle}>
								Vault Policy & Comprehensive Usage Guide
							</h1>
							<div className={styles.metaData}>
								<span>Legal & Compliance Team</span>
								<span className={styles.separator}>•</span>
								<span>Security Dept.</span>
								<span className={styles.separator}>•</span>
								<span>Updated: March 5, 2025</span>
							</div>
						</div>

						{/* ГЛАВНОЕ ИЗОБРАЖЕНИЕ */}
						<div className={styles.imageWrapper}>
							<Image
								src='/vault-image.svg'
								alt='Secure Casino Vault'
								width={800}
								height={450}
								className={styles.vaultImage}
								priority
							/>
						</div>

						{/* КОНТЕНТ */}
						<div className={styles.textBlock}>
							{/* ВСТУПЛЕНИЕ И ЮРИДИЧЕСКИЙ БЛОК */}
							<section className={styles.introSection}>
								<p className={styles.leadText}>
									Welcome to the <strong>Vault</strong> — the advanced asset
									management protocol of our platform. While our standard
									wallets are protected by industry-leading security measures,
									the Vault introduces an institutional-grade layer of
									protection designed for long-term storage, profit segregation,
									and disciplined bankroll management.
								</p>

								<div className={styles.legalWarning}>
									<h3>Eligibility & Legal Compliance</h3>
									<p>
										Access to the Vault service is a privilege strictly
										regulated by international gambling laws. By activating and
										using the Vault storage facility, you explicitly confirm and
										agree to the following:
									</p>
									<ul className={styles.checkList}>
										<li>
											<strong>Age Verification:</strong> You confirm that you
											are <strong>at least 18 years of age</strong> (or of legal
											gambling age in your specific jurisdiction).
										</li>
										<li>
											<strong>Regulatory Acceptance:</strong> You acknowledge
											that you have read, understood, and accepted the{' '}
											<strong>General Terms & Conditions</strong> and{' '}
											<strong>Privacy Policy</strong> (detailed in Section 5 of
											this document).
										</li>
										<li>
											<strong>Source of Funds:</strong> You certify that all
											assets deposited into the Vault originate from legitimate
											sources and are not involved in any illegal activity.
										</li>
									</ul>
								</div>
							</section>

							<hr className={styles.divider} />

							{/* 1. ЧТО ТАКОЕ VAULT */}
							<section>
								<h2>1. The Vault Architecture</h2>
								<p>
									The Vault is not merely a secondary wallet; it is a secure,
									segregated ledger within our database. Think of your main
									balance as your "Checking Account" used for daily transactions
									and active gameplay. The Vault acts as your "Savings Account"
									or a digital safe.
								</p>
								<p>
									Funds stored in the Vault are logically separated from your
									playable balance. This means they cannot be accidentally
									wagered on a slot spin, a sports bet, or a live table game.
									This separation is crucial for players who wish to "lock in"
									their winnings or manage their budget responsibly.
								</p>
							</section>

							{/* 2. ПОДДЕРЖИВАЕМЫЕ ВАЛЮТЫ (ВЕРНУЛИ ЭТОТ БЛОК) */}
							<section>
								<h2>2. Supported Currencies & Assets</h2>
								<p>
									The Vault infrastructure is built to support a diverse
									ecosystem of digital assets. We enable you to store both major
									cryptocurrencies and stablecoins with zero conversion fees for
									internal transfers.
								</p>
								<div className={styles.currencyGrid}>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>₿</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Bitcoin</span>
											<span className={styles.currCode}>BTC</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>Ξ</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Ethereum</span>
											<span className={styles.currCode}>ETH</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>₮</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Tether</span>
											<span className={styles.currCode}>USDT</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>Ł</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Litecoin</span>
											<span className={styles.currCode}>LTC</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>Ð</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Dogecoin</span>
											<span className={styles.currCode}>DOGE</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>✕</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Ripple</span>
											<span className={styles.currCode}>XRP</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>◎</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>Solana</span>
											<span className={styles.currCode}>SOL</span>
										</div>
									</div>
									<div className={styles.currencyCard}>
										<span className={styles.currIcon}>$</span>
										<div className={styles.currInfo}>
											<span className={styles.currName}>USD Coin</span>
											<span className={styles.currCode}>USDC</span>
										</div>
									</div>
								</div>
								<p className={styles.smallNote}>
									* The list of supported assets may be expanded based on
									platform updates and community requests.
								</p>
							</section>

							{/* 3. КАК ИСПОЛЬЗОВАТЬ (РАСШИРЕНО) */}
							<section>
								<h2>3. Operational Guidelines</h2>
								<p>
									To ensure maximum security and ease of use, please follow the
									standard operating procedures below.
								</p>

								<h3>3.1. How to Deposit into the Vault</h3>
								<p>
									Depositing funds into your Vault is an instant process that
									occurs off-chain, meaning you do not have to wait for
									blockchain confirmations or pay gas fees.
								</p>
								<ol className={styles.stepsList}>
									<li>
										Navigate to the <strong>Account</strong> section and select
										the <strong>Vault</strong> tab.
									</li>
									<li>
										Use the "Deposit" interface to select the source currency
										from your Main Balance.
									</li>
									<li>Enter the specific amount you wish to secure.</li>
									<li>
										Confirm the transaction. The funds will move instantly.
									</li>
								</ol>

								<h3>3.2. How to Withdraw</h3>
								<p>
									You can move funds back to your Main Balance at any time for
									gameplay, or withdraw them directly to an external wallet
									(subject to standard security checks).
								</p>
								<ul className={styles.benefitsList}>
									<li>
										✅ <strong>To Main Balance:</strong> Instant transfer, ready
										for play immediately.
									</li>
									<li>
										✅ <strong>To External Wallet:</strong> Requires 2FA
										verification and standard withdrawal processing times.
									</li>
								</ul>
							</section>

							{/* 4. БЕЗОПАСНОСТЬ (РАСШИРЕНО) */}
							<section>
								<h2>4. Security Protocols</h2>
								<p>
									Security is the cornerstone of the Vault. We employ a
									multi-layered defense strategy to ensure your assets are
									impervious to unauthorized access.
								</p>
								<p>
									<strong>Two-Factor Authentication (2FA):</strong> This is
									mandatory for all Vault withdrawals. Even if your password is
									compromised, an attacker cannot access your Vault funds
									without your physical 2FA device.
								</p>
								<p>
									<strong>Cold Storage Integration:</strong> A significant
									portion of the platform's aggregate Vault assets are kept in
									cold storage (offline hardware wallets), ensuring they are
									inaccessible to online threats.
								</p>
								<p>
									<strong>Encryption:</strong> All data related to your Vault
									balance is encrypted using AES-256 standards, both in transit
									and at rest.
								</p>
							</section>

							<hr className={styles.divider} />

							{/* 5. ЮРИДИЧЕСКИЙ ТЕКСТ (ПОЛНЫЙ) */}
							<section className={styles.legalTextSection}>
								<h2>5. Terms & Conditions and Privacy Policy</h2>

								<h3>5.1. General Terms of Service</h3>
								<p>
									By utilizing the Vault, you agree that the facility is not a
									banking service. Funds stored do not accrue interest and are
									not insured by government deposit insurance schemes (such as
									FDIC). You are solely responsible for maintaining the security
									of your account credentials.
								</p>
								<p>
									<strong>Anti-Money Laundering (AML):</strong> We reserve the
									right to freeze Vault assets if we detect suspicious patterns
									indicative of money laundering, structuring, or fraud. In such
									cases, a full KYC investigation will be triggered.
								</p>

								<h3>5.2. Privacy Policy Summary</h3>
								<p>
									<strong>Data Collection:</strong> We collect transaction logs,
									IP addresses, and device fingerprints associated with Vault
									usage to prevent unauthorized access.
								</p>
								<p>
									<strong>Data Usage:</strong> Your data is used strictly for
									internal verification, security monitoring, and legal
									compliance. We do not sell your personal financial data to
									third-party advertisers.
								</p>
								<p>
									<strong>Cookies:</strong> We use secure session cookies to
									maintain your login state while you manage your Vault.
								</p>

								<h3>5.3. Liability</h3>
								<p>
									The platform is not liable for losses resulting from user
									negligence, such as losing access to 2FA devices, sharing
									passwords, or falling victim to phishing attacks.
								</p>
							</section>

							{/* ЗАКЛЮЧЕНИЕ */}
							<section className={styles.finalThoughts}>
								<h2>Final Statement</h2>
								<p>
									The Vault represents our commitment to player security and
									responsible gaming. By using this feature, you take control of
									your financial experience, ensuring that your winnings are
									preserved and your gaming remains fun and sustainable.
								</p>
								<p className={styles.signature}>
									— The "Casino Name" Security Team
								</p>
							</section>
						</div>

						{/* КНОПКА УБРАНА ПО ЗАПРОСУ */}
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
