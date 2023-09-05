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
import Radar from "../../radar/Radar";

const PlayerStatisticRadar = () => {
    const context = useStatisticContext();
    const {state} = context;
    const { playerInfo, league, position, dynamicMode, dictionary } = state;
    const [option, setOption] = useState<RadarConfig>();
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
      const indicators: RadarLabel[] = data.values.map((value: any) => {
        return { text: getStatisticLabel(value.type).toUpperCase(), max: dynamicMode ? 100: value.best }
      });
      const playerValues: number[] = data.values.map((value: any) => value.value);
      const averageValues: number[] = dynamicMode ? [] : data.values.map((value: any) => value.average);

      setOption(createOptions(dynamicMode, playerInfo, indicators, playerValues, averageValues, isNarrow, clubColors));
    }, [dynamicMode, playerInfo, dictionary, data, clubColors, mode, isNarrow])

    if (isLoading || !option) {
      const emptyIndicator = { text: '...', max: 100 }
      return (
        <div className={styles.playerRadarContainer}>
                <ReactECharts
                  style={{height: '700px', width: '100%'}}
                  option={createOptions(dynamicMode, playerInfo, [emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator], [], [], isNarrow)}
                  className={styles.playerStatisticRadar}
                />
        </div>
      )
    } else if (error || !data) {
      return <span>An unexpected error occured.</span>
    }

    return (
        <div className={styles.playerRadarContainer}>
            <Radar config={option} className={styles.playerStatisticRadar}/>
        </div>
    )
}

function createOptions(
  isDynamicMode: boolean,
  playerInfo: PlayerInfo,
  indicators: RadarLabel[],
  playerValues: number[],
  averageValues: number[] | undefined,
  isNarrow: boolean,
  clubColors: ClubColors = { primary: '#000000', secondary: '#000000' },
): RadarConfig {
  console.log(indicators.length);
  return {
    startAngle: 90,
    percentage: true,
    radius: 600,

    datasets: [
      {
        name: playerInfo.name,
        data: playerValues,
        areaColor: clubColors.primary,
        lineColor: clubColors.secondary,
      }
    ],
    labels: indicators,
    categories: [
      {
          name: 'Shooting',
          color: '#ff3b18',
          space: 4
      },
      {
          name: 'Playmaking',
          color: '#013594',
          space: 4
      },
      {
          name: 'Possession',
          color: '#01ff41',
          space: 6
      },
      {
          name: "Passing",
          color: '#ff7300',
          space: 6
      },
      {
          name: "Defending",
          color: '#00b36e',
          space: 2
      }
    ]
  }
}

export default PlayerStatisticRadar;