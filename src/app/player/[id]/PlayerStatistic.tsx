'use client'

import React, { HTMLAttributes, useEffect, useState } from 'react';
import styles from './page.module.css';
import { convertPercentageToLetter, getGradeColor } from '@/app/utils/grades';
import PlayerStatisticData from './PlayerStatisticData';
import { PlayerRanking, getPlayerStatRanking } from '@/app/api/player';
import { getCountryEmoji } from '@/app/utils/emojis';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    id: string,
    position: string,
    statType: string,
    stat: string
    label: string;
    value: number;
}

const PlayerStatistic: React.FC<Properties> = ({ id, position, statType, stat, label, value }) => {
    const color = getGradeColor(convertPercentageToLetter(value))
    const [ranking, setRanking] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        if (!buttonClicked)
            return;
        getPlayerStatRanking(id, position, statType, stat)
            .then((data) => setRanking(data));
    }, [id, position, statType, stat, label, value, buttonClicked]);
    
    return (
        <div className={styles.playerStatistic}
            onClick={() => {
                setButtonClicked(true);
                (document.getElementById(`${label}${value}`) as HTMLDialogElement)?.showModal()
            }}
        >
            <div className={styles.playerStatisticLabelSection}>
                <h1 className={styles.playerStatisticLabel}>{label.toUpperCase()}</h1>
            </div>
            <div className={styles.playerStatisticRatingSection}>
                <h1 className={`${styles.playerStatisticRating} ${styles.unselectable}`} style={{color: `${color}`, border:`10px solid ${color}`}}>{convertPercentageToLetter(value)}</h1>
            </div>
            <div className={styles.playerStatisticModalSection}>
                <dialog id={`${label}${value}`} className={styles.playerStatisticModal}>
                    <div className={styles.playerStatisticModalContainer}>
                        <h1 className={styles.playerStatisticModalTitle}>{label.toUpperCase()}</h1>
                        <div className={styles.playerStatisticModalRanking}>
                            <h2 className={styles.playerStatisticModalRankingName}>Ranking</h2>
                            {ranking ? renderRanking(ranking) : <p>Loading...</p>}
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    )
}

interface ValuesProperties extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
}

function renderRanking(ranking: PlayerRanking) {
    return (
      <ul className={styles.playerStatisticModalRankingList}>
        {ranking.ranking.map((player) => (
          <li key={player.id + "-ranking"} className={styles.playerStatisticModalRankingListElement}>{getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}</li>
        ))}
      </ul>
    );
  }
  

/**
export const PlayerStatisticValues: React.FC<ValuesProperties> = ({ label, value }) => {
    const grade = convertPercentageToLetter(value)
    const color = getGradeColor(grade)
    return (
        <div className={styles.playerStatisticValue}>
            <div className={styles.basicPlayerStatisticInfo}>
                <p className={styles.playerStatisticRating} style={{color: `${color}`, borderColor: `${color}`}}>{grade}</p>
                <b className={styles.playerStatisticName}>{label.toUpperCase()}</b>
            </div>
            <div className={styles.playerStatisticBarSection}>
                <progress className={styles.playerStatisticBar} value={value} max={100} style={{ '--color-accent': color }}/>
            </div>
        </div>
    )
}
*/

export default PlayerStatistic;
