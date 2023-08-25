'use client'

import styles from './page.module.css';

const Radar = () => {

    return (
        <div className={styles.radar}>
            <div className={styles.radarCircle}>
                <div className={styles.radarSteps}>
                    {makeSteps(25, ['red', 'blue'])}
                </div>
                {makeRadarPoint()}
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
                <div className={styles.radarStep} style={{width:currentWidth, border:`${size}px solid ${currentColor}`}}>

                </div>
            );
        }
        return stepElements;
    }
    function makeRadarPoint() {
        return (
            <div className={styles.radarPoint}>
            </div>
        )
    }
}

export default Radar;