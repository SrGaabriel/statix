interface RadarConfig {
    data: number[],
    labels: RadarLabel[]
}

interface RadarLabel {
    text: string,
    max: number
}