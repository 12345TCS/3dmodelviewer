import React from 'react';
import styles from './SelectGroup.module.css';

export default function SelectGroup({ label, options, value, onChange }) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.group}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.btn} ${value === opt.value ? styles.active : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
