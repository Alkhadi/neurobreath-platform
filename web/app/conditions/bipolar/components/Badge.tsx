'use client';

import React from 'react';
import styles from '../styles/Page.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
