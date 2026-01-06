'use client';

import React from 'react';
import styles from '../styles/Page.module.css';

interface HeroProps {
  title: string;
  subtitle: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
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
