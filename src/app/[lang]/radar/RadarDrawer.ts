import { animateEasing, easeInOutCubic } from "@/app/utils/animations";
import { RadarRender } from "./Radar";

export default class RadarDrawer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    
    centerX: number;
    centerY: number;

    config: RadarConfig;
    points: number;
    labels: RadarLabel[];

    constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, config: RadarConfig) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.config = config;
        this.points = config.labels.length;
        this.labels = config.labels;
    }

    drawData(startTime: number, activeDatasets: string[], lastRender: RadarRender, hoveredPoint: number) {
        const time = Date.now() - startTime;
        const animationTime = 1000;
        if (hoveredPoint !== -1) {
            console.log(hoveredPoint);
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
        this.config.datasets.forEach(dataset => {
            const isDatasetActive = activeDatasets.includes(dataset.name);
            const lastRenderedDatasetValues = lastRender[dataset.name];
            const isDatasetVanishing = lastRenderedDatasetValues && !isDatasetActive && lastRenderedDatasetValues.active;
            const isDatasetAppearing = lastRenderedDatasetValues && isDatasetActive && !lastRenderedDatasetValues.active;

            if (isDatasetActive || isDatasetVanishing) {
                if (!this.config.percentage) {
                    this.ctx.beginPath();
                }
                let firstValue = 0;
                for (let i = 0; i < this.points; i++) {
                    const currentDatasetValue = isDatasetVanishing ? 0 :dataset.data[i];
                    const valueExistedBefore = !(!lastRenderedDatasetValues) && lastRenderedDatasetValues.values.length > i;
                    const lastValue = valueExistedBefore && !isDatasetAppearing ? lastRenderedDatasetValues.values[i] : 0;
                    const animateValue = !(valueExistedBefore && lastValue === currentDatasetValue);
                    const value = animateValue ?
                            animateEasing(
                                time,
                                lastValue,
                                currentDatasetValue,
                                animationTime,
                                easeInOutCubic
                            )
                        : currentDatasetValue;
                    if (i === 0) {
                        firstValue = value;
                    }
                    const { x, y } = RadarDrawer.completeValueToCoordinate(value, i, this.labels[i].max, this.points, this.centerX, this.centerY);
                    if (this.config.percentage) {
                        const isNewlyBeingHovered = lastRenderedDatasetValues && lastRenderedDatasetValues.hovered !== i && (hoveredPoint === i);
                        const isNoLongerBeingHovered = lastRenderedDatasetValues && lastRenderedDatasetValues.hovered === i && (hoveredPoint !== i);
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = this.getCategoryByIndex(i)?.color ?? dataset.lineColor;
                        this.ctx.fillStyle = this.getCategoryByIndex(i)?.color ?? dataset.areaColor;
                        const startAngle = (Math.PI * 2 * i) / this.points;
                        const endAngle = startAngle + (Math.PI * 2 / this.points);
                        const radius = Math.sqrt(Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2));
                        this.ctx.arc(this.centerX, this.centerX, radius, startAngle, endAngle);
                        this.ctx.lineTo(this.centerX, this.centerY);
                        this.ctx.globalAlpha = hoveredPoint === i ? (isNewlyBeingHovered ? animateEasing(
                            time,
                            0.7,
                            1,
                            animationTime,
                            easeInOutCubic
                        ) : 1) : isNoLongerBeingHovered ? animateEasing(
                            time,
                            1,
                            0.7,
                            animationTime,
                            easeInOutCubic
                        ): 0.5 + value/this.labels[i].max /2.5;
                        this.ctx.fill();
                        this.ctx.closePath();
                    } else {
                        if (i === 0) {
                            this.ctx.moveTo(x, y);
                        } else {
                            this.ctx.lineTo(x, y);
                        }
                        if (i === this.points - 1) {
                            const firstPoint = RadarDrawer.completeValueToCoordinate(firstValue, 0, this.labels[0].max, this.points, this.centerX, this.centerY);
                            this.ctx.lineTo(firstPoint.x, firstPoint.y);
                        }
                    }
                }
                if (!this.config.percentage) {
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.strokeStyle = dataset.lineColor;
                    this.ctx.fillStyle = dataset.areaColor;
                    this.ctx.lineWidth = 3;
                    this.ctx.fill();
                    this.ctx.fillStyle = `rgba(${dataset.areaColor}, 0.6})`;
                    this.ctx.globalAlpha = 1;
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        });
        this.ctx.globalAlpha = 1;
    }

    drawScales() {
        const colors = ['gray', 'lightgray']
        for (let i = 0; i < this.config.steps; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, (this.config.diameter / 2 / this.config.steps) * (this.config.steps-i), 0, Math.PI * 2);
            this.ctx.fillStyle = colors[i % colors.length];
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    drawLines() {
        for (let i = 0; i < this.points; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            const coordinate = this.valueToCoordinate(this.labels[i].max, i);
            this.ctx.lineTo(coordinate.x, coordinate.y);
            this.ctx.strokeStyle = 'white';
            this.ctx.globalAlpha = 0.5;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.globalAlpha = 1;
    }

    drawDots() {
        this.config.datasets.forEach(dataset => {
            for (let i = 0; i < this.points; i++) {
                const coordinate = this.valueToCoordinate(dataset.data[i], i);
                this.ctx.beginPath();
                this.ctx.arc(coordinate.x, coordinate.y, 5, 0, Math.PI * 2);
                this.ctx.fillStyle = dataset.lineColor;
                this.ctx.fill();
                this.ctx.closePath();
            }
        });
    }

    valueToCoordinate(value:number, index: number) {
        const angle = (Math.PI * 2 * index) / this.points;
        const normalizedValue = value / this.labels[index].max;
        const radius = normalizedValue * (Math.min(this.centerX, this.centerY) * 1);
        const x = this.centerX + Math.cos(angle) * radius;
        const y = this.centerY + Math.sin(angle) * radius;
        return { x, y };
    }

    getCategoryByIndex(index: number) {
        return RadarDrawer.getCategoryByIndex(this.config, index);
    }

    static getCategoryByIndex(config: RadarConfig, index: number) {
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
    }

    getHoveredPoint(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const distance = Math.sqrt(Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2));

        if (distance > this.config.diameter/2) {
            return -1;
        }
        const angleFactor = Math.PI * 2 / this.points;
        let angle = Math.atan2(y - this.centerY, x - this.centerX);
        angle = angle < 0 ? angle + Math.PI * 2 : angle;
        const index = Math.floor(angle / angleFactor);

        return index;
    }

    getHoveredDataset(clientX: number, clientY: number) {

    }

    static completeValueToCoordinate(value:number, index: number, max: number, pointTotal: number, centerX: number, centerY: number) {
        const angle = (Math.PI * 2 * index) / pointTotal;
        const normalizedValue = value / max;
        const radius = normalizedValue * (Math.min(centerX, centerY) * 1);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        return { x, y };
    }
}