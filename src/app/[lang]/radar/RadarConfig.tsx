interface RadarConfig {
    datasets: RadarDataset[],
    labels: RadarLabel[],
    categories: RadarCategory[],
    startAngle: number,
    diameter: number,
    percentage: boolean,
    steps: number
}

interface RadarLabel {
    text: string,
    max: number
}

interface RadarCategory {
    name: string,
    color: string,
    space: number
}

interface RadarDataset {
    name: string,
    data: number[],
    lineColor: string,
    areaColor: string
}