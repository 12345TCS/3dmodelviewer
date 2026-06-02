import React, { useState } from 'react';
import styles from './SectionCard.module.css';

export default function SectionCard({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.card}>
      <button className={styles.header} onClick={() => setOpen((o) => !o)}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.chevron} ${open ? styles.up : ''}`}>›</span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  );
}
