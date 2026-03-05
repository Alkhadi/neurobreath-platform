'use client';

import React from 'react';
import styles from '../styles/Page.module.css';

interface HeroProps {
  title: string;
  subtitle: string;
  topSlot?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, topSlot }) => {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
        {topSlot && (
          <div className={styles.heroTopSlot}>
            {topSlot}
          </div>
        )}
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            {title}
          </h1>
          <p className={styles.heroSubtitle}>{subtitle}</p>
        </div>
      </div>
    </section>
  );
};
