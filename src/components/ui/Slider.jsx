import React from 'react';
import styles from './Slider.module.css';

export default function Slider({ label, value, min, max, step = 0.01, onChange, formatValue }) {
  const display = formatValue ? formatValue(value) : value.toFixed(2);
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{display}</span>
      </div>
      <input
        type="range"
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
