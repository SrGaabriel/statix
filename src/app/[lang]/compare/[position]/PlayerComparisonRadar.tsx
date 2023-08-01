'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { getClubColors } from "@/app/utils/colors";

interface Properties {
    names: [string, string, string?],
    indicators: any,
    firstPlayerValues: any,
    secondPlayerValues: any,
    thirdPlayerValues?: any,
}

const PlayerComparisonRadar: React.FC<Properties> = ({
    names: [firstPlayerName, secondPlayerName, thirdPlayerName],
    indicators,
    firstPlayerValues,
    secondPlayerValues,
    thirdPlayerValues
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
            [firstPlayerName, secondPlayerName, thirdPlayerName],
            indicators,
            firstPlayerValues,
            secondPlayerValues,
            thirdPlayerValues,
        ));
    }, [setOption, isNarrow, indicators, firstPlayerName, secondPlayerName, thirdPlayerName, firstPlayerValues, secondPlayerValues, thirdPlayerValues]);

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
    names: [string, string, string?],
    indicators: any,
    firstPlayerValues: any,
    secondPlayerValues: any,
    thirdPlayerValues?: any
): echarts.EChartsOption {
    const legend = thirdPlayerValues ? [names[0], names[1], names[2]!!] : [names[0], names[1]];
    const firstColor = '#1FE06C'
    const secondColor = '#460186'
    const thirdColor = '#E01F93'

    return {
        color: thirdPlayerValues ? [firstColor, secondColor, thirdColor] : [firstColor, secondColor],
        legend: {
          data: legend,
          bottom: 0
        },
        radar: [
          {
            indicator: indicators,
            startAngle: 90,
            splitNumber: 8,
            radius: isNarrow ? 100 : 300,
            shape: 'circle',
            axisName: {
              color: '#333',
              fontSize: isNarrow ? 6 : 15,
              fontFamily: 'Roboto',
              fontWeight: 'bolder',
              padding: isNarrow ? 0 : 15,
              
            },
            splitArea: {
              areaStyle: {
                color: ['#8a8a8a', '#c0c0c0' ],
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
              {
                name: names[0],
                value: firstPlayerValues,
                areaStyle: {
                  color: firstColor
                }
              },
              {
                name: names[1],
                value: secondPlayerValues,
                areaStyle: {
                  color: secondColor
                }
              },
              !thirdPlayerValues ? {} : {
                name: names[2],
                value: thirdPlayerValues,
                areaStyle: {
                    color: thirdColor
                }
              }
            ]
          }
        ]
    };
}

export default PlayerComparisonRadar;