'use client';

import React from 'react';
import styles from '../styles/Page.module.css';

interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  children,
  className = '',
  icon,
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && (
        <h3 className={styles.cardTitle}>
          {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
          {title}
        </h3>
      )}
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};
