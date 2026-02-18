'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './LanguageSelector.module.scss';

interface ILanguage {
    code: string;
    flag: string;
    label: string;
}

const languages: ILanguage[] = [
    { code: 'En', flag: '/flag_usa.svg', label: 'English' },
    { code: 'Ru', flag: '/flag_usa.svg', label: 'Russian' },
    { code: 'De', flag: '/flag_usa.svg', label: 'German' },
];

const LanguageSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedLang, setSelectedLang] = useState<ILanguage>(languages[0]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (lang: ILanguage) => {
        setSelectedLang(lang);
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            {/* Кнопка переключения */}
            <button 
                className={`${styles.button} ${isOpen ? styles.active : ''}`} 
                onClick={toggleDropdown}
                type="button"
            >
                {/* Группируем флаг и текст слева */}
                <div className={styles.contentLeft}>
                    <Image 
                        src={selectedLang.flag}
                        alt={selectedLang.label}
                        width={28}
                        height={20}
                        className={styles.flag}
                        priority
                    />
                    <span className={styles.langCode}>
                        {selectedLang.code}
                    </span>
                </div>

                {/* Стрелка справа */}
                <Image 
                    src='/openButton.svg'
                    alt='arrow'
                    width={20}
                    height={20}
                    className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
                />
            </button>

            {/* Выпадающий список */}
            {isOpen && (
                <ul className={styles.dropdown}>
                    {languages.map((lang) => (
                        <li 
                            key={lang.code} 
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(lang)}
                            aria-selected={selectedLang.code === lang.code}
                        >
                            <Image 
                                src={lang.flag} 
                                alt={lang.label} 
                                width={24} 
                                height={16}
                                className={styles.dropdownFlag} 
                            />
                            <span>{lang.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;