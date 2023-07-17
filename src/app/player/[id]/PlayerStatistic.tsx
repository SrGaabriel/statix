'use client'

import React, { HTMLAttributes, useEffect, useState } from 'react';
import styles from './page.module.css';
import { convertPercentageToLetter, getGradeColor } from '@/app/utils/grades';
import { PlayerInfo, PlayerRanking, getPlayerStatRanking } from '@/app/api/player';
import { getCountryEmoji } from '@/app/utils/emojis';
import { getExplanationForAttribute } from '@/app/utils/attributes';
import { getClubColors } from '@/app/utils/colors';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    info: PlayerInfo,
    position: string,
    statType: string,
    stat: string
    label: string;
    value: number;
}

const PlayerStatistic: React.FC<Properties> = ({ info, position, statType, stat, label, value }) => {
    const id = info.id;
    const color = getGradeColor(convertPercentageToLetter(value))
    const [ranking, setRanking] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        if (!buttonClicked)
            return;
        getPlayerStatRanking(id, position, statType, stat)
            .then((data) => setRanking(data));
    }, [id, position, statType, stat, label, value, buttonClicked]);
    
    const clubColors = getClubColors(info.club);
    return (
        <div className={styles.playerStatistic}
            onClick={() => {
                const dialog = (document.getElementById(`${label}${value}`) as HTMLDialogElement)
                if (dialog.open)
                    return false;
                setButtonClicked(true);
                dialog.showModal();
            }}
            style={{
                '--gradient': `linear-gradient(white, white), linear-gradient(90deg, ${clubColors.primary}, ${clubColors.secondary})`,
            }}
        >
            <div className={styles.playerStatisticLabelSection}>
                <h1 className={styles.playerStatisticLabel}>{label.toUpperCase()}</h1>
            </div>
            <div className={styles.playerStatisticRatingSection}>
                <h1 className={`${styles.playerStatisticRating} ${styles.unselectable}`} style={{color: `${color}`, border:`10px solid ${color}`}}>{convertPercentageToLetter(value)}</h1>
            </div>
            <div className={styles.playerStatisticModalSection}>
                <dialog id={`${label}${value}`} className={styles.playerStatisticModal} onAbort={() => setButtonClicked(false)}>
                    <div className={styles.playerStatisticModalContainer}>
                        <h1 className={styles.playerStatisticModalTitle}>{label.toUpperCase()}</h1>
                        <p className={styles.playerStatisticModalDescription}>{getExplanationForAttribute(stat)}</p>
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
        {ranking.ranking.map((player, index) => (
          <li key={player.id + "-ranking"} className={styles.playerStatisticModalRankingListElement}>{index+1}. {getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}</li>
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
