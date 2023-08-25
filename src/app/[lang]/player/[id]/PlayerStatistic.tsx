'use client'

import React, { HTMLAttributes, useState } from 'react';
import styles from './page.module.css';
import { convertPercentageToLetter, getGradeColor } from '@/app/utils/grades';
import { statisticRankFetcher } from '@/app/api/player';
import { getCountryEmoji } from '@/app/utils/emojis';
import { getClubColors } from '@/app/utils/colors';
import useSWR from 'swr';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import { useStatisticContext } from './StatisticContext';
import { getStatisticExplanation, getStatisticMeasure } from '@/app/utils/naming';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    stat: string,
    label: string,
    value: number,
    percentage: number
}

const PlayerStatistic: React.FC<Properties> = ({ stat, label, value, percentage }) => {
    const context = useStatisticContext();
    const {state} = context;
    const { playerInfo, league, position, statisticType, fullView, ratingMode, dictionary } = state;
    const color = getGradeColor(convertPercentageToLetter(percentage))
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
            return <p>{dictionary.error}</p>
        }
        return (
          <ul className={styles.playerStatisticModalRankingList}>
            {data.ranking.map(player => {
                if (player.id === playerInfo.id) {
                    return (
                        <p key="ownuser-ranking" className={`${styles.playerStatisticModalRankingListElementLink} ${styles.playerStatisticModalRankingListElementLinkOwn}`}>
                            {player.rank}. {getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}
                        </p>
                    )
                }

                return (<li key={player.id + "-ranking"} className={styles.playerStatisticModalRankingListElement}>
                    <Link href={`/${dictionary.code}/player/${player.id}`} className={styles.playerStatisticModalRankingListElementLink}>
                        {player.rank}. {getCountryEmoji(player.nation)} {player.name} {player.value.toFixed(2)}
                    </Link>
                </li>)
            })}
          </ul>
        );
    }

    const closeModal = () => {
        const dialog = (document.getElementById(`${label}${stat}`) as HTMLDialogElement);
        dialog.close();
    }
    const display = ratingMode ? convertPercentageToLetter(percentage) : (Number.isInteger(value) ? Math.round(value) : value.toFixed(1));
    const statisticLabel = (ratingMode ? label : getStatisticMeasure(dictionary, stat)) ?? label;
    const clubColors = getClubColors(playerInfo.club);

    const calculateDisplayFontSize = () => {
        // calculates font size depending on the length of the display string
        const length = display.toString().length;
        const initialValue = fullView ? 600 : 180;
        const lengthFactor = fullView ? 20 : 10;
        const fontSize = initialValue - (length * lengthFactor);
        return `${fontSize}%`;
    }

    const gradientStyle: any = {
        '--gradient': `linear-gradient(white, white), linear-gradient(90deg, ${clubColors.primary}, ${clubColors.secondary})`,
        '--grade-color': color,
    }
    const ratingStyle: any = {
        '--grade-color': color,
        fontSize: calculateDisplayFontSize()
    }

    const statisticStylesheet = fullView ? styles.playerStatistic : styles.compactPlayerStatistic;
    return (
        <div className={statisticStylesheet}>
            <div className={styles.actualPlayerStatistic} onClick={() => {
                let dialog = (document.getElementById(`${label}${stat}`) as HTMLDialogElement);
                if (dialog.open)
                    return;
                setButtonClicked(true);
                dialog.showModal();
            }}>
                {fullView ? renderFull() : renderCompact()}
            </div>
            <div className={styles.playerStatisticModalSection}>
                <dialog id={`${label}${stat}`} className={styles.playerStatisticModal} onClose={() => setButtonClicked(false)}>
                    <div className={styles.playerStatisticModalContainer}>
                        <div className={styles.playerStatisticModalTitleContainer}>
                            <h1 className={styles.playerStatisticModalTitle}>{label.toUpperCase()}</h1>
                            <button className={styles.playerStatisticModalCloseButton} onClick={() => closeModal()}>
                                X
                            </button>
                        </div>
                        <p className={styles.playerStatisticModalDescription}>{buttonClicked && getStatisticExplanation(dictionary, stat)}</p>
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
                    <h1 className={styles.playerStatisticLabel}>{statisticLabel.toUpperCase()}</h1>
                </div>
                <div className={styles.playerStatisticRatingSection}>
                    <h1 className={`${styles.playerStatisticRating} ${styles.unselectable}`} style={ratingStyle}>{display}</h1>
                </div>
            </div>
        )
    }
    function renderCompact() {
        return (
            <div className={styles.compactPlayerStatisticContainer} style={gradientStyle}>
                <h1 className={styles.compactPlayerStatisticLabel}>{statisticLabel.toUpperCase()}</h1>
                <h1 className={`${styles.compactPlayerStatisticRating} ${styles.unselectable}`} style={ratingStyle}>{display}</h1>
            </div>
        )
    }
    
}

export default PlayerStatistic;
