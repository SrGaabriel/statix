'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

interface Properties {
    names: [string, string, string?, string?],
    indicators: any,
    firstPlayerValues: any,
    secondPlayerValues: any,
    thirdPlayerValues?: any,
    fourthPlayerValues?: any
}

const PlayerComparisonRadar: React.FC<Properties> = ({
    names: [firstPlayerName, secondPlayerName, thirdPlayerName, fourthPlayerName],
    indicators,
    firstPlayerValues,
    secondPlayerValues,
    thirdPlayerValues,
    fourthPlayerValues
}) => {
    const [option, setOption] = useState<echarts.EChartsOption>({});
    const [isNarrow, setIsNarrow] = useState<boolean>(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1200px)");
        const onChange = () => setIsNarrow(!!mql.matches);
    
        mql.addListener(onChange);
        setIsNarrow(mql.matches);
    
        return () => mql.removeListener(onChange);
      }, []);

    useEffect(() => {
        setOption(createOptions(
            isNarrow,
            [firstPlayerName, secondPlayerName, thirdPlayerName, fourthPlayerName],
            indicators,
            firstPlayerValues,
            secondPlayerValues,
            thirdPlayerValues,
            fourthPlayerValues
        ));
    }, [setOption, isNarrow, indicators, firstPlayerName, secondPlayerName, thirdPlayerName, fourthPlayerName, fourthPlayerValues, firstPlayerValues, secondPlayerValues, thirdPlayerValues]);

    return (
        <div className={styles.playerRadarContainer}>
            <div id="chart" className={styles.playerRadarChart}>
                <ReactECharts option={option} style={{height: isNarrow ? '400px' : '800px', width: '100%'}} className={styles.playerStatisticRadar}/>
            </div>
        </div>
    )
}

function createOptions(
    isNarrow: boolean,
    names: [string, string, string?, string?],
    indicators: any,
    firstPlayerValues: any,
    secondPlayerValues: any,
    thirdPlayerValues?: any,
    fourthPlayerValues?: any
): echarts.EChartsOption {
    const legend = (thirdPlayerValues ? fourthPlayerValues ? names : [names[0], names[1], names[2]] : [names[0], names[1]]) as string[]

    const colors = ['#1b1b1b', '#ff7300', '#ffffff', '#5a01a3']

    const object: echarts.EChartsOption = {
        color: colors,
        legend: {
          data: legend,
          textStyle: {
            fontFamily: 'Montserrat',
            fontSize: isNarrow ? 8 : 14,
          },
          itemGap: isNarrow? 30 : 50,
          bottom: 0
        },
        radar: [
          {
            indicator: indicators,
            startAngle: 180,
            splitNumber: 11,
            radius: isNarrow ? 100 : 300,
            shape: 'circle',
            zlevel: 0,
            axisName: {
              color: '#333',
              fontSize: isNarrow ? 6 : 15,
              fontFamily: 'Roboto',
              fontWeight: 'bolder',
              padding: isNarrow ? 0 : 15,
            },
            splitArea: {
              areaStyle: {
                color: ['#8a8a8a', '#cacaca' ],
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10
              }
            },
            axisLine: {
              symbol: ['none', 'none'],
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            }
          },
        ],
        series: [
          {
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 10
              }
            },
            data: [
            ]
          }
        ]
    };

    const addDataToSeries = (name: string, value: any, color: string) => {
        // @ts-ignore
        object.series[0].data.push({
            name: name,
            value: value,
            symbol: 'none',
            areaStyle: {
              color: color
            }
        })
    }

    const firstColor = '#1b1b1b'
    const secondColor = '#ff7300'
    const thirdColor = '#fffb00'
    const fourthColor = "#5a01a3"
    addDataToSeries(names[0], firstPlayerValues, '#1b1b1b')
    addDataToSeries(names[1], secondPlayerValues, '#ff730071')
    if (thirdPlayerValues) {
        addDataToSeries(names[2]!!, thirdPlayerValues, '#ffffff86')
        if (fourthPlayerValues) {
            addDataToSeries(names[3]!!, fourthPlayerValues, '#5a01a371')
        }
    }

    return object;
}

export default PlayerComparisonRadar;