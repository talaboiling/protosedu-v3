
import React from 'react';
import styles from './HPBs_Form.module.css';

export default function HPBs_Form({ header, paragraph, buttons, additionalContent=null }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{header}</h1>
      <p className={styles.paragraph}>{paragraph}</p>
      {additionalContent}
      <div className={styles.buttonsContainer}>
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={styles.button}
            style={btn.styles || {}}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
