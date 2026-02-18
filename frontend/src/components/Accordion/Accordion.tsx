'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import classes from './Accordion.module.scss';

// 1. Определение типа для одного элемента аккордеона
export interface AccordionItemData {
  id: number;
  question: string;
  answer: string;
  // Путь к иконке (если нужна)
  iconSrc?: string; 
  iconAlt?: string;
}

// 2. Определение типа пропсов для компонента Accordion
interface AccordionProps {
  items: AccordionItemData[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  // Состояние для хранения ID открытого элемента.
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className={classes.accordionContainer}>
      {items.map((item) => {
        const isOpen = item.id === openItemId;
        const displayId = item.id < 10 ? `0${item.id}` : item.id.toString();

        return (
          <div key={item.id} className={classes.item}>
            
            {/* Заголовок (Кнопка) */}
            <button 
              className={classes.header} 
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <div className={classes.questionContent}>
                <span className={classes.itemNumber}>{displayId}</span>
                <span className={classes.questionText}>{item.question}</span>
              </div>

              {/* Иконка (Next.js Image) и Toggle Icon */}
              <div className={classes.iconWrapper}>
                {item.iconSrc && (
                  <Image 
                    src={item.iconSrc} 
                    alt={item.iconAlt || item.question}
                    width={18}
                    height={18}
                    className={classes.itemIcon}
                  />
                )}
                
                {/* Иконка +/- или стрелка для открытия/закрытия */}
                <span className={`${classes.toggleIcon} ${isOpen ? classes.open : ''}`}>
                  —
                </span>
              </div>
            </button>

            {/* Тело (Ответ) - Используем класс для max-height и padding */}
            <div 
              className={`${classes.content} ${isOpen ? classes.contentOpen : ''}`} 
              aria-hidden={!isOpen}
            >
              <div 
                className={classes.answerText}
                dangerouslySetInnerHTML={{ __html: item.answer.replace(/\n/g, '<br/>') }}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default memo(Accordion);