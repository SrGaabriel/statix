'use client'

import assert from 'assert';
import styles from './page.module.css';
import React, { HTMLAttributes, useCallback, useEffect, useState } from 'react';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    config: RadarConfig;
}

const Radar: React.FC<Properties> = ({config}) => {
    assert(config.datasets.length > 0, 'Radar must have at least one dataset');
    assert(config.labels.length > 0, 'Radar must have at least one label');
    assert(!(config.datasets.length > 1 && config.percentage), 'Percentage radars with more than one dataset are not yet supported')

    const labels = config.labels;
    const pointTotal = labels.length;
    const [activeDatasets, setActiveDatasets] = useState<number[]>(config.datasets.map((_, index) => index).slice().reverse());

    const getCategoryByIndex = useCallback((index: number) => {
        if (config.categories.length === 0) {
            return null;
        }
        if (config.categories.length === 1) {
            return config.categories[0];
        }
        let usedSpace = 0;
        let foundCategory = config.categories[0];
        for (let i = 0; i < config.categories.length; i++) {
            const category = config.categories[i];
            usedSpace += category.space;
            if (index < usedSpace) {
                foundCategory = category;
                break;
            }
        }
        return foundCategory;
    }, [config.categories]);
    useEffect(() => {
        config.datasets.forEach((_, index) => {
            if (activeDatasets.includes(index)) {
                return;
            }

            const canvas = document.getElementById(`radarChart-${index}`)!! as HTMLCanvasElement;
            canvas.style.opacity = '0';
            canvas.style.scale = '0';
        });
        activeDatasets.forEach(index => {
            const dataset = config.datasets[index];
            const canvas = document.getElementById(`radarChart-${index}`)!! as HTMLCanvasElement;
            canvas.style.opacity = '1';
            canvas.style.scale = '1';
            const ctx = canvas.getContext('2d')!!;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            function valueToCoordinate(value:number, index: number) {
                const angle = (Math.PI * 2 * index) / pointTotal;
                const normalizedValue = value / labels[index].max;
                const radius = normalizedValue * (Math.min(centerX, centerY) * 1);
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                return { x, y };
            }

            function redrawRadarChart() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (config.percentage) {
                    for (let i = 0; i < pointTotal; i++) {
                        ctx.beginPath();
                        ctx.strokeStyle = getCategoryByIndex(i)?.color ?? dataset.lineColor;
                        ctx.fillStyle = getCategoryByIndex(i)?.color ?? dataset.areaColor;
                        ctx.lineWidth = 3;

                        if (config.percentage) {
                            const linkIndex = i === 0 ? 0 : i;
                            const { x, y } = completeValueToCoordinate(dataset.data[i], linkIndex, labels[i].max, pointTotal, centerX, centerY);
                            const startAngle = (Math.PI * 2 * linkIndex) / pointTotal;
                            const endAngle = startAngle + (Math.PI * 2 / pointTotal);
                            const radius = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                            ctx.moveTo(centerX, centerY);
                            ctx.arc(centerX, centerX, radius, startAngle, endAngle)
                            const initialCoordinates = valueToCoordinate(dataset.data[i], i);
                            ctx.lineTo(centerX, centerY);
                            ctx.lineTo(initialCoordinates.x, initialCoordinates.y);
                            ctx.lineTo(x, y);
                        }

                        ctx.globalAlpha = 0.6;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.stroke();
                        ctx.closePath();
                    }
                } else {
                    ctx.beginPath();
                    for (let i = 0; i < pointTotal; i++) {
                        const { x, y } = valueToCoordinate(dataset.data[i], i);
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.strokeStyle = dataset.lineColor;
                    ctx.fillStyle = dataset.areaColor;
                    ctx.lineWidth = 3;
                    ctx.fill();
                    ctx.fillStyle = `rgba(${dataset.areaColor}, 0.6})`;
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            redrawRadarChart();
        });
    }, [labels, pointTotal, config, activeDatasets, getCategoryByIndex]);
        
    return (
        <div className={styles.radar}>
            <div className={styles.radarContent}>
                <div className={styles.radarCircle} style={{width: config.radius}}>
                    <div className={styles.radarSteps}>
                        {makeLabels()}
                        {makeSteps(25, ['gray', 'gainsboro'])}
                        {makeCategories()}
                        {
                            config.datasets.map((dataset, index) => {
                                const datasetStyle = {
                                    zIndex: 4 + activeDatasets.indexOf(index) 
                                }
                                return <>
                                    {makeRadarPoints(dataset, index)}
                                    <canvas id={`radarChart-${index}`} width={config.radius} height={config.radius} style={datasetStyle} className={styles.radarCanvas}></canvas>
                                </>
                            })
                        }
                    </div>
                </div>
                <div className={styles.radarLabels}>
                </div>
            </div>
            <div className={styles.radarLegend}>
                {config.datasets.map((dataset, index) => {
                    const isActive = activeDatasets.includes(index);
                    return (
                        <div key={`radarLegendButton-${index}`} className={styles.radarLegendContainer} onClick={() => {
                            if (isActive) {
                                setActiveDatasets(activeDatasets.filter(i => i !== index));
                            } else {
                                setActiveDatasets([...activeDatasets, index]);
                            }
                        }}>
                            <div className={styles.radarLegendColor} style={{backgroundColor: isActive ? dataset.areaColor : 'gray'}}/>
                            <span className={styles.radarLegendName} style={{opacity: isActive ? '1' : '0.7'}}>{dataset.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
    function makeLabels() {
        const labelElements = [];
        for (let i = 0; i < pointTotal; i++) {
            const label = labels[i];
            const isPointInTheLeftSide = i > pointTotal / 4 && i < pointTotal * 0.75;
            const { x, y } = completeValueToCoordinate(1.1, i, 1, pointTotal, config.radius/2, config.radius/2);
            const labelStyle = {
                zIndex: config.percentage ? 6 : 4,
                top: `${y}px`,
                left: `${x}px`,
                transform: `translateX(${isPointInTheLeftSide ? '-100%' : '0'})`
            }
            labelElements.push(
                <div className={styles.radarLabel} style={labelStyle}>{label.text}</div>
            )
        }
        return labelElements;
    }
    function makeSteps(size: number, colors: string[]) {
        const stepElements = [];
        const steps = config.radius / (size*2);
        for (let i = 0; i < steps; i++) {
            const currentWidth = config.radius - (i * size*2);
            const currentColor = colors[i%colors.length];
            stepElements.push(
                <div className={styles.radarStep} style={{width:currentWidth, border:`${size*1.06}px solid ${currentColor}`}}/>
            );
        }
        return stepElements;
    }
    function makeLines() {
        const lineElements = [];
        const pointNumber = Math.ceil(pointTotal/2);
        const lineAngle = 180 / pointNumber;
        for (let i = 0; i < pointNumber; i++) {
            const currentAngle = lineAngle * i;
            const lineStyle = {
                transform: `rotate(${currentAngle}deg)`,
                zIndex: config.percentage ? 6 : 4,
                height: '1.3px',
                width: config.radius
            }
            lineElements.push(
                <div className={styles.radarLine} style={lineStyle}/>
            )
        }
        return lineElements;
    }
    function makeRadarPoints(dataset: RadarDataset, index: number) {
        const pointElements = [];
        if (config.percentage) {
            return [];
        }
        for (let i = 0; i < pointTotal; i++) {
            const pointValue = dataset.data[i];
            const pointMax = labels[i].max;
            pointElements.push(makeRadarPoint(i, pointValue, pointMax, dataset.lineColor, index));
        }
        return pointElements;
    }
    function makeRadarPoint(pointIndex: number, pointValue: number, pointMax: number, color: string, datasetIndex: number) {
        const pointSize = 10;
        const coordinate = completeValueToCoordinate(pointValue, pointIndex, pointMax, pointTotal, config.radius/2, config.radius/2);
        const isActivated = activeDatasets.includes(datasetIndex);

        const pointStyle = {
            width: `${pointSize}px`,
            height: `${pointSize}px`,
            top: `calc(${coordinate.y}px - ${pointSize/2}px)`,
            left: `calc(${coordinate.x}px - ${pointSize/2}px)`,
            backgroundColor: color,
            zIndex: 5 + activeDatasets.indexOf(datasetIndex),
            opacity: isActivated ? '1' : '0'
        }
        return (
            <div className={styles.radarPoint} style={pointStyle}/>
        )
    }
    function makeCategories() {
        const categoryElements: any[] = []
        let usedSpace = 0;
        config.categories.map((category, index) => {
            const angleFactor = 360 / pointTotal;
            const context: any = {
                '--degree': `${angleFactor * (category.space + usedSpace)}deg`,
                '--smoothing':'0.1deg',
                '--color':category.color,
                rotate: '90deg',
                zIndex: 4 - config.categories.length - index,
                width: `${config.radius + 20}px`,
                height: `${config.radius + 20}px`,
            }
            usedSpace += category.space;
            categoryElements.push(
                <div key={`category-${index}`} className={styles.radarCategory} style={context}/>
            )
        });
        return categoryElements;
    }
}

function completeValueToCoordinate(value:number, index: number, max: number, pointTotal: number, centerX: number, centerY: number) {
    const angle = (Math.PI * 2 * index) / pointTotal;
    const normalizedValue = value / max;
    const radius = normalizedValue * (Math.min(centerX, centerY) * 1);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y };
}


export default Radar;