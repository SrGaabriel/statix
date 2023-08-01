'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import useSWR from "swr";
import { useStatisticContext } from "./StatisticContext";
import { PlayerInfo, playerProfileFetcher } from "@/app/api/player";
import { ClubColors, getClubColors } from "@/app/utils/colors";
import { getShortenedStatisticName, getStatisticName } from "@/app/utils/naming";

const PlayerStatisticRadar = () => {
    const context = useStatisticContext();
    const {state} = context;
    const { playerInfo, league, position, dynamicMode, dictionary } = state;
    const [option, setOption] = useState<echarts.EChartsOption>({});
    const mode = dynamicMode ? 'dynamic' : 'absolute';
    const { data, error, isLoading } = useSWR(`/api/${playerInfo.id}/profile/${league}/${position}?mode=${mode}`, () => playerProfileFetcher(playerInfo.id, league, position, mode))
    const clubColors = getClubColors(playerInfo.club);
    const [isNarrow, setIsNarrow] = useState<boolean>(false);

    useEffect(() => {
      const mql = window.matchMedia("(max-width: 1200px)");
      const onChange = () => setIsNarrow(!!mql.matches);
  
      mql.addListener(onChange);
      setIsNarrow(mql.matches);
  
      return () => mql.removeListener(onChange);
    }, []);

    useEffect(() => {
      const getStatisticLabel = (type: string) => isNarrow ? getShortenedStatisticName(dictionary, type) : getStatisticName(dictionary, type);

      if (!data) return;
      const indicators = data.values.map((value: any) => {
        return { text: getStatisticLabel(value.type).toUpperCase(), max: dynamicMode ? 100: value.best }
      });
      const playerValues: number[] = data.values.map((value: any) => value.value);
      const averageValues: number[] = dynamicMode ? [] : data.values.map((value: any) => value.average);

      setOption(createOptions(dynamicMode, playerInfo, indicators, playerValues, averageValues, isNarrow, clubColors));
    }, [dynamicMode, playerInfo, dictionary, data, clubColors, mode, isNarrow])

    if (isLoading) {
      const emptyIndicator = { text: '...', max: 100 }
      return (
        <div className={styles.playerRadarContainer}>
            <div id="chart" className={styles.playerRadarChart}>
                <ReactECharts
                  style={{height: '700px', width: '100%'}}
                  option={createOptions(dynamicMode, playerInfo, [emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator], [], [], isNarrow)}
                  className={styles.playerStatisticRadar}
                />
            </div>
        </div>
      )
    } else if (error || !data) {
      return <span>An unexpected error occured.</span>
    }

    return (
        <div className={styles.playerRadarContainer}>
            <div id="chart" className={styles.playerRadarChart}>
                <ReactECharts option={option} style={{height: '800px', width: '100%'}} className={styles.playerStatisticRadar}/>
            </div>
        </div>
    )
}

function createOptions(
  isDynamicMode: boolean,
  playerInfo: PlayerInfo,
  indicators: { text: string, max: number }[],
  playerValues: number[],
  averageValues: number[] | undefined,
  isNarrow: boolean,
  clubColors: ClubColors = { primary: '#000000', secondary: '#000000' },
): echarts.EChartsOption {
  const averageData = isDynamicMode ? {} : {
    name: 'Average',
    value: averageValues,
    areaStyle: {
      color: '#ffffffa7'
    }
  };
  return {
    color: [clubColors.secondary, '#575757'],
    grid: {
      top: 100,
      bottom: 100,
      containLabel: true
    },
    legend: {
      data: [playerInfo.name, 'Average'],
      bottom: 0,
    },
    radar: [
      {
        indicator: indicators,
        startAngle: 90,
        splitNumber: 8,
        radius: isNarrow ? 65 : 300,
        shape: 'circle',
        axisName: {
          color: '#333',
          fontSize: isNarrow ? 5 : 15,
          fontFamily: 'Roboto',
          fontWeight: 'bolder',
          padding: isNarrow ? 3 : 15,
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
            name: playerInfo.name,
            value: playerValues,
            areaStyle: {
              color: clubColors.primary
            }
          },
          averageData
        ]
      }
    ]
  };
}

export default PlayerStatisticRadar;