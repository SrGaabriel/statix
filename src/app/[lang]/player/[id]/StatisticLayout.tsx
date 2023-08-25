'use client'

import styles from './page.module.css'
import Header from '@/app/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { OUTFIELD_POSITIONS, getStatisticName } from '@/app/utils/naming';
import React, { Dispatch, HTMLAttributes, useEffect, useState, useRef } from 'react';
import { Action, useStatisticContext } from './StatisticContext';
import PlayerStatistic from './PlayerStatistic';
import PlayerStatisticRadar from './PlayerStatisticRadar';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    playerData: any,
    isLoading?: boolean,
    isProfile?: boolean
}

const StatisticLayout: React.FC<Properties> = ({playerData, isLoading=false, isProfile=false}) => {
    const { state, dispatch } = useStatisticContext();
    const { playerInfo, league, position, statisticType, fullView, ratingMode, dynamicMode, dictionary } = state;
    const [localFullView, setLocalFullView] = useState(fullView);
    const [localRatingMode, setLocalRatingMode] = useState(ratingMode);
    const [localDynamicMode, setLocalDynamicMode] = useState(dynamicMode);

    useEffect(() => {
        if (localFullView != fullView) {
            dispatch({ type: 'SET_FULL_VIEW_MODE', payload: localFullView });
        }
        if (localRatingMode != ratingMode) {
            dispatch({ type: 'SET_RATING_MODE', payload: localRatingMode });
        }
        if (localDynamicMode != dynamicMode) {
            dispatch({ type: 'SET_DYNAMIC_MODE', payload: localDynamicMode });
        }
    }, [localFullView, dispatch, fullView, localDynamicMode, dynamicMode, localRatingMode, ratingMode]);

    const positions = OUTFIELD_POSITIONS.filter(pos => pos !== position);
    const leagues = ['premier_league', 'ligue_1', 'serie_a', 'bundesliga', 'la_liga', 'brasileirao', 'top_5'].filter(nleague => league !== nleague);

    const makeEmptyStatistic = () => {
        return (
            <div className={styles.playerStatistic}>
                <div className={styles.playerStatisticContainer}>
                    <h1 className={`${styles.playerStatisticLabel} ${styles.invisibleText} ${styles.unselectable}`}>LOADING</h1>
                    <p className={`${styles.playerStatisticRating} ${styles.loadingPlayerStatisticRating}`}>--</p>
                </div>
            </div>
        )
    };

    let statistics;
    if (isLoading) {
        statistics = 
            (<>
                {makeEmptyStatistic()}
                {makeEmptyStatistic()}
                {makeEmptyStatistic()}
                {makeEmptyStatistic()}
                {makeEmptyStatistic()}
                {makeEmptyStatistic()}
            </>)
    } else if (isProfile) {
        statistics = <PlayerStatisticRadar/>
    } else if (playerData) {
        const dataset = playerData[statisticType]
        statistics = [];
        for (const key in dataset) {
            const statistic = dataset[key];
            statistics.push(
                (<PlayerStatistic stat={key} label={getStatisticName(dictionary, key)} value={statistic.value} percentage={statistic.percentage}/>)
            )
        }
    }

    return (
        <div className={styles.page}>
            <Header dictionary={dictionary}/>
            <main className={styles.main}>
                <div className={styles.playerDataColumn}>
                    <div className={styles.playerData}>
                        <h1 className={styles.playerName}>{playerInfo.name}</h1> 
                        <div className={styles.playerInfo}>
                            <div className={styles.playerBadgeSection}>
                                <Image
                                    className={styles.playerBadge}
                                    src={playerInfo.has_image ? `https://www.sportsbase.io/images/people/${playerInfo.base_id}.png` : `/badges/${playerInfo.club}.png`}
                                    alt={`${playerInfo.club} badge`}
                                    width={140}
                                    height={140}
                                />
                            </div>
                            <div className={styles.playerBasicStats}>
                                {position !== "goalkeeper" && <h4>{`${dictionary.statistics.compare_to} ${dictionary.other}`.toUpperCase()}</h4>}
                                {position !== "goalkeeper" && <div className={styles.positionBlocks}>
                                    {positions.map(pos => createPositionBlock(dictionary, pos, dispatch))}
                                </div>}
                                <h4>{dictionary.from.toUpperCase()}</h4>
                                <div className={styles.positionBlocks}>
                                    {leagues.map(league => createLeagueBlock(dictionary, league, dispatch))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.playerStatsSection}>
                    <div className={styles.playerStatsUpperSection}>
                        {getHeaderButtons(playerInfo.id, statisticType, position, dictionary, dispatch)}
                        <div className={styles.playerStatsUpperSectionSecondRow}>
                            {getModeToggles()}
                        </div>
                    </div>
                    <div className={styles.playerStatisticsContainer}>
                        {statistics}
                    </div>
                </div>
            </main>
        </div>
    )
    function getModeToggles() {
        if (statisticType == "profile") {
            return <>
                {createModeToggle(dictionary.statistics.ratings.toUpperCase(), dictionary.statistics.values.toUpperCase(), localDynamicMode, setLocalDynamicMode)}
            </>
        }

        return <>
            {createModeToggle(dictionary.statistics.standard.toUpperCase(), dictionary.statistics.compact.toUpperCase(), localFullView, setLocalFullView)}
            {createModeToggle(dictionary.statistics.ratings.toUpperCase(), dictionary.statistics.values.toUpperCase(), localRatingMode, setLocalRatingMode)}
        </>
    }
}

function createPositionBlock(dictionary: any, position: string, dispatch: Dispatch<Action>) {
    return (
        <button className={styles.positionBlock} onClick={() => dispatch({ type: 'SET_POSITION', payload: position })}>
            <Image
                src={`/icons/${position}.png`}
                alt={`${position} icon`}
                width={16}
                height={16}
            />
            {dictionary.position[position + 's'].toUpperCase()}
        </button>
    )
}

function createLeagueBlock(dictionary: any, league: string, dispatch: Dispatch<Action>) {
    return (
        <button className={styles.positionBlock} onClick={() => dispatch({ type: 'SET_LEAGUE', payload: league })}>
            <Image
                src={`/leagues/${league}.png`}
                alt={`${league} icon`}
                width={16}
                height={16}
            />
            {dictionary.leagues[league].toUpperCase()}
        </button>
    )
}

function createModeToggle(
    disabledName: string,
    enabledName: string,
    currentMode: boolean,
    modeSetter: (mode: boolean) => void
) {
    return (
        <div className={styles.compactToggle}>
            <div onClick={() => modeSetter(true)} className={`${styles.compactHalf} ${styles.compactStandardHalf} ${currentMode ? styles.compactActiveHalf : ''}`}>
                <button className={`${styles.compactToggleButton} ${styles.compactToggleButtonStandard}`}>{disabledName}</button>
            </div>
            <div className={`${styles.compactHalf} ${styles.compactCompactHalf} ${currentMode ? '' : styles.compactActiveHalf}`}>
                <button onClick={() => modeSetter(false)} className={`${styles.compactToggleButton} ${styles.compactToggleButtonCompact}`}>{enabledName}</button>
            </div>
        </div>
    )
}

function getHeaderButtons(id: string, currentStatType: string, position: string, dictionary: any, dispatch: Dispatch<Action>) {
    const createButton = (id: string, label: string) => {
        const className = id === currentStatType ? `${styles.playerStatsHeaderButton} ${styles.playerStatsHeaderButtonActive}` : styles.playerStatsHeaderButton;
        return (<div onClick={() => dispatch({ type: 'SET_STATISTIC_TYPE', payload: id })} className={className}>
            <button className={styles.playerStatsHeaderButtonText}>{label}</button>
        </div>)
    }

    if (position === "goalkeeper") {
        return (
            <div className={styles.playerStatsHeaders}>
                {createButton("profile", dictionary.statistics.profile)}
                {createButton("overall", dictionary.statistics.overall)}
                {createButton("shot-stopping", dictionary.statistics.shot_stopping)}
                {createButton("distribution", dictionary.statistics.distribution)}
                {createButton("sweeping", dictionary.statistics.sweeping)}
                {createButton("superstitions", dictionary.statistics.superstitions)}
                <Link href={{ pathname: `/${dictionary.code}/compare`, query: { first: id } }} className={`${styles.playerStatsHeaderButton} ${styles.compareHeaderButton}`}>
                    <button className={`${styles.playerStatsHeaderButtonText} ${styles.compareHeaderButtonText}`}>{dictionary.statistics.compare}</button>
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.playerStatsHeaders}>
            {createButton("profile", dictionary.statistics.profile)}
            {createButton("shooting", dictionary.statistics.shooting)}
            {createButton("playmaking", dictionary.statistics.playmaking)}
            {createButton("possession", dictionary.statistics.possession)}
            {createButton("passing", dictionary.statistics.passing)}
            {createButton("defending", dictionary.statistics.defending)}
            {createButton("superstitions", dictionary.statistics.superstitions)}
            <Link href={{ pathname: `/${dictionary.code}/compare`, query: { first: id } }} className={`${styles.playerStatsHeaderButton} ${styles.compareHeaderButton}`}>
                <button className={`${styles.playerStatsHeaderButtonText} ${styles.compareHeaderButtonText}`}>{dictionary.statistics.compare}</button>
            </Link>
        </div>
    )
}

export default StatisticLayout;