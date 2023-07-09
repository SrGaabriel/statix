import React, { useState, useEffect, useRef, ChangeEvent, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { convertPercentageToLetter, getGradeColor } from '@/app/utils/grades';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    label: string;
}

const PlayerStatistic: React.FC<Properties> = ({ label, children }) => {
    
    return (
        <div className={styles.playerStatistic}>
            <div
                className={styles.playerStatisticLabelSection}
            >
                <h1 className={styles.playerStatisticLabel}>{label.toUpperCase()}</h1>
            </div>
            <div className={styles.playerStatisticValuesSection}> 
                {children}
            </div>
        </div>
    )
}

interface ValuesProperties extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
}

export const PlayerStatisticValues: React.FC<ValuesProperties> = ({ label, value }) => {
    const grade = convertPercentageToLetter(value)
    const color = getGradeColor(grade)
    return (
        <div className={styles.playerStatisticValue}>
            <div className={styles.basicPlayerStatisticInfo}>
                <p className={styles.playerStatisticRating} style={{color: `${color}`, borderColor: `${color}`}}>{grade}</p>
                <b className={styles.playerStatisticName}>{label.toUpperCase()}</b>
            </div>
            <div className={styles.playerStatisticBarSection}>
                <progress className={styles.playerStatisticBar} value={value} max={100} style={{ '--color-accent': color }}/>
            </div>
        </div>
    )
}

export default PlayerStatistic;
