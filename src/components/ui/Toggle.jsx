import React from 'react';
import styles from './Toggle.module.css';

export default function Toggle({ label, checked, onChange }) {
  return (
    <label className={styles.row}>
      <span className={styles.label}>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        className={`${styles.track} ${checked ? styles.on : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
}
