'use client'

import React, { HTMLAttributes, useState } from 'react';
import styles from './page.module.css';
import { convertPercentageToLetter, getGradeColor } from '@/app/utils/grades';
import { statisticRankFetcher } from '@/app/api/player';
import { getCountryEmoji } from '@/app/utils/emojis';
import { getExplanationForAttribute } from '@/app/utils/attributes';
import { getClubColors } from '@/app/utils/colors';
import useSWR from 'swr';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import { useStatisticContext } from './StatisticContext';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    stat: string
    label: string;
    playerData: any;
}

const PlayerStatistic: React.FC<Properties> = ({ stat, label, playerData }) => {
    const context = useStatisticContext();
    const {state} = context;
    const { playerInfo, league, position, statisticType, fullView } = state;
    const value = playerData[statisticType][stat];
    const color = getGradeColor(convertPercentageToLetter(value))
    const [buttonClicked, setButtonClicked] = useState(false);
    const { data, error, isLoading } = useSWR(buttonClicked ? `/api/${playerInfo.id}/${position}/${league}/${statisticType}/${stat}` : null, () => statisticRankFetcher(playerInfo.id, position, league, statisticType, stat), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    function renderRanking() {
        if (isLoading) {
            return (
                <div className={styles.loadingPlayerStatisticModalRankingList}>
                    <br/>
                    <Loading/>
                    <br/>
                </div>
            )
        } else if (error || !data) {
            return <p>An unexpected error occured.</p>
        }
        return (
          <ul className={styles.playerStatisticModalRankingList}>
            {data.ranking.map(player => {
                if (player.id === playerInfo.id)
                    return (
                        <p className={`${styles.playerStatisticModalRankingListElementLink} ${styles.playerStatisticModalRankingListElementLinkOwn}`}>
                            {player.rank}. {getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}
                        </p>
                    )

                return (<li key={player.id + "-ranking"} className={styles.playerStatisticModalRankingListElement}>
                    <Link href={`/player/${player.id}`} className={styles.playerStatisticModalRankingListElementLink}>
                        {player.rank}. {getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}
                    </Link>
                </li>)
            })}
          </ul>
        );
    }
    const clubColors = getClubColors(playerInfo.club);
    const gradientStyle: any = {
        '--gradient': `linear-gradient(white, white), linear-gradient(90deg, ${clubColors.primary}, ${clubColors.secondary})`,
        '--grade-color': color
    }

    return (
        <div className={styles.playerStatistic}
            onClick={() => {
                const dialog = (document.getElementById(`${label}${value}`) as HTMLDialogElement);
                if (dialog.open)
                    return;
                setButtonClicked(true);
                dialog.showModal();
            }}
        >
            {fullView ? renderFull() : renderCompact()}
            <div className={styles.playerStatisticModalSection}>
                <dialog id={`${label}${value}`} className={styles.playerStatisticModal} onClose={() => setButtonClicked(false)}>
                    <div className={styles.playerStatisticModalContainer}>
                        <h1 className={styles.playerStatisticModalTitle}>{label.toUpperCase()}</h1>
                        <p className={styles.playerStatisticModalDescription}>{buttonClicked && getExplanationForAttribute(stat)}</p>
                        <div className={styles.playerStatisticModalRanking}>
                            <h2 className={styles.playerStatisticModalRankingName}>Ranking{data && ` (${data.total} players in filter)`}</h2>
                            {buttonClicked && renderRanking()}
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    )
    function renderFull() {
        return (
            <div className={styles.playerStatisticContainer} style={gradientStyle}>
                <div className={styles.playerStatisticLabelSection}>
                    <h1 className={styles.playerStatisticLabel}>{label.toUpperCase()}</h1>
                </div>
                <div className={styles.playerStatisticRatingSection}>
                    <h1 className={`${styles.playerStatisticRating} ${styles.unselectable}`} style={gradientStyle}>{convertPercentageToLetter(value)}</h1>
                </div>
            </div>
        )
    }
    function renderCompact() {
        return (
            <div className={styles.compactPlayerStatisticContainer} style={gradientStyle}>
                <h1 className={styles.compactPlayerStatisticLabel}>{label.toUpperCase()}</h1>
                <h1 className={`${styles.compactPlayerStatisticRating} ${styles.unselectable}`} style={{color: `${color}`, border:`10px solid ${color}`}}>{convertPercentageToLetter(value)}</h1>
            </div>
        )
    }

    if (fullView) return renderFull();
    return renderCompact();
}

export default PlayerStatistic;
