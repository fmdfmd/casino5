'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CaretLeft, Check } from '@phosphor-icons/react';
import s from './test.module.scss';

const EditProfile = () => {
	const [characteristics, setCharacteristics] = useState({
		hand: 'Правая',
		side: 'Левый',
		gameType: 'Оба',
	});

	return (
		<section className={s.editProfile}>
			<div className={s.container}>
				<header className={s.header}>
					<Link href='/profile' className={s.backBtn}>
						<CaretLeft size={20} weight='bold' />
					</Link>
					<div className={s.headerTitle}>
						<h1 className={s.title}>Редактировать профиль</h1>
					</div>
				</header>

				<form className={s.form} onSubmit={(e) => e.preventDefault()}>
					{/* ОБЩАЯ СЕТКА: 2 колонки одинаковой высоты */}
					<div className={s.mainLayout}>
						{/* ЛЕВАЯ КОЛОНКА: Поля ввода */}
						<div className={s.inputsColumn}>
							<div className={s.field}>
								<input type='text' className={s.input} placeholder=' ' />
								<label className={s.label}>Фамилия</label>
							</div>

							<div className={s.field}>
								<input type='text' className={s.input} placeholder=' ' />
								<label className={s.label}>Имя</label>
							</div>

							<div className={s.field}>
								<input type='text' className={s.input} placeholder=' ' />
								<label className={s.label}>Отчество</label>
							</div>

							<div className={s.field}>
								<input type='text' className={s.input} placeholder=' ' />
								<label className={s.label}>Дата рождения</label>
							</div>

							<div className={s.field}>
								<input type='text' className={s.input} placeholder=' ' />
								<label className={s.label}>Город</label>
							</div>

							<div className={s.field}>
								<input type='email' className={s.input} placeholder=' ' />
								<label className={s.label}>E-mail</label>
							</div>
						</div>

						{/* ПРАВАЯ КОЛОНКА: Настройки */}
						<div className={s.prefsColumn}>
							<div className={s.characteristicsCard}>
								<h3 className={s.cardTitle}>Предпочтения</h3>

								{/* Контейнер для кнопок, распределяем их равномерно */}
								<div className={s.charList}>
									{/* Рука */}
									<div className={s.charGroup}>
										<span className={s.charLabel}>Рука</span>
										<div className={s.optionsRow}>
											{['Обе', 'Левая', 'Правая'].map((opt) => (
												<button
													key={opt}
													type='button'
													className={`${s.optionBtn} ${characteristics.hand === opt ? s.active : ''}`}
													onClick={() =>
														setCharacteristics({
															...characteristics,
															hand: opt,
														})
													}
												>
													{characteristics.hand === opt && (
														<Check weight='bold' size={14} />
													)}
													<span>{opt}</span>
												</button>
											))}
										</div>
									</div>

									{/* Квадрат */}
									<div className={s.charGroup}>
										<span className={s.charLabel}>Квадрат</span>
										<div className={s.optionsRow}>
											{['Оба', 'Левый', 'Правый'].map((opt) => (
												<button
													key={opt}
													type='button'
													className={`${s.optionBtn} ${characteristics.side === opt ? s.active : ''}`}
													onClick={() =>
														setCharacteristics({
															...characteristics,
															side: opt,
														})
													}
												>
													{characteristics.side === opt && (
														<Check weight='bold' size={14} />
													)}
													<span>{opt}</span>
												</button>
											))}
										</div>
									</div>

									{/* Тип игр */}
									<div className={s.charGroup}>
										<span className={s.charLabel}>Тип игр</span>
										<div className={s.optionsRow}>
											{['Оба', 'Друж.', 'Турниры'].map((opt) => (
												<button
													key={opt}
													type='button'
													className={`${s.optionBtn} ${characteristics.gameType === opt ? s.active : ''}`}
													onClick={() =>
														setCharacteristics({
															...characteristics,
															gameType: opt,
														})
													}
												>
													{characteristics.gameType === opt && (
														<Check weight='bold' size={14} />
													)}
													<span>{opt}</span>
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<button type='submit' className={s.saveBtn}>
						Сохранить изменения
					</button>
				</form>
			</div>
		</section>
	);
};

export default EditProfile;
