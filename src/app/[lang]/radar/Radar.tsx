'use client'

import styles from './page.module.css';
import React, { HTMLAttributes } from 'react';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    config: RadarConfig;
}

const Radar: React.FC<Properties> = ({config}) => {
    const values = config.data;
    const labels = config.labels;
    const pointTotal = config.data.length;
    return (
        <div className={styles.radar}>
            <div className={styles.radarCircle}>
                <div className={styles.radarSteps}>
                    {makeSteps(30, ['gray', 'gainsboro'])}
                    {makeLines()}
                </div>
            </div>
        </div>
    )
    function makeSteps(size: number, colors: string[]) {
        const stepElements = [];
        const steps = 600 / (size*2);
        for (let i = 0; i < steps; i++) {
            const currentWidth = 600 - (i * size*2);
            const currentColor = colors[i%colors.length];
            stepElements.push(
                <div className={styles.radarStep} style={{width:currentWidth, border:`${size*1.06}px solid ${currentColor}`}}>

                </div>
            );
        }
        return stepElements;
    }
    function makeLines() {
        const lineElements = [];
        const pointNumber = pointTotal/2;
        const lineAngle = 180 / pointNumber;
        for (let i = 0; i < pointNumber; i++) {
            const currentAngle = lineAngle * i;
            const lineStyle = {
                transform: `rotate(${currentAngle}deg)`
            }
            lineElements.push(
                <div className={styles.radarLine} style={lineStyle}>
                    {makeRadarPoint(i, values[i], 100)}
                    {makeRadarPoint(i+(pointNumber), values[i+pointNumber], 100)}
                </div>
            )
        }
        return lineElements;
    }
    function makeRadarPoint(pointIndex: number, pointValue: number, pointMax: number) {
        const pointSize = 10;
        const percent = (pointValue / pointMax) * 50;

        const direction = pointIndex >= (pointTotal/2) ? {
            right: `calc(${50 + percent}% - ${pointSize}px)`
        } : {
            left: `calc(${50 + percent}% - ${pointSize}px)`
        }
        const pointStyle = {
            width: `${pointSize}px`,
            height: `${pointSize}px`,
            ...direction
        }
        return (
            <div className={styles.radarPoint} style={pointStyle}>
                <span>{pointValue}</span>
            </div>
        )
    }
}

export default Radar;