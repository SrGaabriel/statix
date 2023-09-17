'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import useSWR from "swr";
import { useStatisticContext } from "./StatisticContext";
import { PlayerInfo, playerProfileFetcher } from "@/app/api/player";
import { ClubColors, getClubColors } from "@/app/utils/colors";
import { getParentPosition, getShortenedStatisticName, getStatisticName } from "@/app/utils/naming";
import Radar from "../../radar/Radar";
import { getSpacesForCategoryByPosition } from "@/app/utils/positions";

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

      setOption(createOptions(position, playerInfo, indicators, playerValues, averageValues, isNarrow, clubColors));
    }, [dynamicMode, playerInfo, dictionary, data, clubColors, mode, isNarrow, position])

    if (isLoading || !option) {
      const emptyIndicator = { text: '...', max: 100 }
      return (
        <div className={styles.playerRadarContainer}>
                <ReactECharts
                  style={{height: '700px', width: '100%'}}
                  option={createOptions(position, playerInfo, [emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator, emptyIndicator], [], [], isNarrow)}
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
  position: string,
  playerInfo: PlayerInfo,
  indicators: RadarLabel[],
  playerValues: number[],
  averageValues: number[] | undefined,
  isNarrow: boolean,
  clubColors: ClubColors = { primary: '#000000', secondary: '#000000' },
): RadarConfig {
  const parentPosition = getParentPosition(position);
  return {
    startAngle: 90,
    percentage: true,
    diameter: 600,
    steps: 11,
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
          color: '#ef476f',
          space: getSpacesForCategoryByPosition(parentPosition, 'shooting')
      },
      {
          name: 'Playmaking',
          color: '#ffd166',
          space: getSpacesForCategoryByPosition(parentPosition, 'playmaking')
      },
      {
          name: 'Possession',
          color: '#06d6a0',
          space: getSpacesForCategoryByPosition(parentPosition, 'possession')
      },
      {
          name: "Passing",
          color: '#118ab2',
          space: getSpacesForCategoryByPosition(parentPosition, 'passing')
      },
      {
          name: "Defending",
          color: '#073b4c',
          space: getSpacesForCategoryByPosition(parentPosition, 'defending')
      }
    ]
  }
}

export default PlayerStatisticRadar;