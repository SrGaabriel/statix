'use client'

import assert from 'assert';
import styles from './page.module.css';
import React, { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { animateEasing, easeInOutCubic } from '@/app/utils/animations';
import RadarDrawer from './RadarDrawer';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    config: RadarConfig;
}

const Radar: React.FC<Properties> = ({config}) => {
    assert(config.datasets.length > 0, 'Radar must have at least one dataset');
    assert(config.labels.length > 0, 'Radar must have at least one label');
    assert(!(config.datasets.length > 1 && config.percentage), 'Percentage radars with more than one dataset are not yet supported')

    const labels = config.labels;
    const pointTotal = labels.length;
    const [activeDatasets, setActiveDatasets] = useState<string[]>(config.datasets.map(dataset => dataset.name));
    const [lastRender, setLastRender] = useState<string>('{}');
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

    const saveRender = useCallback(() => {
        const render: RadarRender = {};
        config.datasets.forEach(dataset => {
            render[dataset.name] = {
                values: dataset.data,
                active: activeDatasets.includes(dataset.name),
                hovered: hoveredIndex
            };
        });
        setLastRender(JSON.stringify(render));
    }, [config.datasets, activeDatasets, hoveredIndex]);
    useEffect(() => {
        const canvas = document.getElementById(`radar-canvas`) as HTMLCanvasElement;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d')!!;
        const radarDrawer = new RadarDrawer(canvas, ctx, config);

        if (false) {
            window.addEventListener('mousemove', (event) => {
                const currentlyHoveredPoint = radarDrawer.getHoveredPoint(event.clientX, event.clientY);
                if (currentlyHoveredPoint !== hoveredIndex) {
                    setHoveredIndex(currentlyHoveredPoint);
                }
            });
        }

        const startDate = Date.now();
        function drawData() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() - startDate;
            const animationTime = 1000;
            const isAnimationOver = time > animationTime;

            radarDrawer.drawScales();
            if (!config.percentage) {
                radarDrawer.drawLines();
            }
            radarDrawer.drawData(startDate, activeDatasets, decodeRender(lastRender), hoveredIndex);
            if (config.percentage) {
                radarDrawer.drawLines();
            } else {
                radarDrawer.drawDots();
            }
            
            if (!isAnimationOver) {
                requestAnimationFrame(drawData);
            } else {
                saveRender();
            }
        }
        drawData();
    }, [config, activeDatasets, lastRender, saveRender, hoveredIndex]);
        
    return (
        <div className={styles.radar}>
            <div className={styles.radarContent}>
                <div className={styles.radarCircle} style={{width: config.diameter}}>
                    <canvas id={`radar-canvas`} width={config.diameter} height={config.diameter} className={styles.radarCanvas}/>
                    <div className={styles.radarSteps}>
                        {drawLabels()}
                    </div>
                </div>
                <div className={styles.radarLabels}>
                </div>
            </div>
            <div className={styles.radarLegend}>
                {config.datasets.map((dataset, index) => {
                    const isActive = activeDatasets.includes(dataset.name);
                    return (
                        <div key={`radarLegendButton-${index}`} className={styles.radarLegendContainer} onClick={() => {
                            if (isActive) {
                                setActiveDatasets(activeDatasets.filter(i => i !== dataset.name));
                            } else {
                                setActiveDatasets([...activeDatasets, dataset.name]);
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
    function drawLabels() {
        const labelElements: any[] = [];
        for (let i = 0; i < pointTotal; i++) {
            const label = labels[i];
            const isPointInTheLeftSide = i > Math.floor(pointTotal / 4) && i < Math.floor(pointTotal * 0.75);
            const { x, y } = completeValueToCoordinate(1.1, i+0.5, 1, pointTotal, config.diameter/2, config.diameter/2);
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
    function drawValues() {
        const valueElements: any[] = [];
        config.datasets.forEach((dataset, datasetIndex) => {
            for (let i = 0; i < pointTotal; i++) {
                const isPointInTheLeftSide = i > Math.floor(pointTotal / 4) && i < Math.floor(pointTotal * 0.75);
                const { x, y } = completeValueToCoordinate(dataset.data[i]*0.9, i+0.5, labels[i].max, pointTotal, config.diameter/2, config.diameter/2);
                const valueStyle = {
                    zIndex: config.percentage ? 6 : 4,
                    top: `${y}px`,
                    left: `${x}px`,
                    transform: `translateX(${isPointInTheLeftSide ? '-50%' : '-50%'})`
                }
                valueElements.push(
                    <div className={styles.radarValue} style={valueStyle}>{Math.floor(dataset.data[i])}</div>
                )
            }
        });
        return valueElements;
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

export type RadarRender = { [dataset: string]: RadarDatasetRender }

type RadarDatasetRender = {
    values: number[],
    active: boolean,
    hovered: number
}

function decodeRender(render: string): RadarRender {
    return JSON.parse(render);
}

function isDatasetActive(dataset: RadarDataset, activeDatasets: string[]) {
    return activeDatasets.includes(dataset.name);
}

export default Radar;