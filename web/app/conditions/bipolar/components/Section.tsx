'use client';

import React from 'react';
import styles from '../styles/Page.module.css';

interface SectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray';
}

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  children,
  className = '',
  background = 'white',
}) => {
  return (
    <section
      id={id}
      className={`${styles.section} ${className} ${background === 'gray' ? 'bg-muted' : 'bg-background'}`}
    >
      <div className={styles.container}>
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        {children}
      </div>
    </section>
  );
};
