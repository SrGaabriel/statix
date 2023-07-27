'use client'

import styles from './page.module.css'
import { getCountryEmoji } from '@/app/utils/emojis';
import Header from '@/app/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { getLeagueName, getPositionName } from '@/app/utils/defaults';
import DropdownMenu from '@/app/components/DropdownMenu';
import { Dispatch, useEffect, useState } from 'react';
import { Action, useStatisticContext } from './StatisticContext';

interface Properties {
    children: React.ReactNode;
}

export default function StatisticLayout({children}: Properties) {
    const { state, dispatch } = useStatisticContext();
    const { playerInfo, league, position, statisticType, fullView, dynamicMode } = state;
    const [localFullView, setLocalFullView] = useState(fullView);
    const [localDynamicMode, setDynamicMode] = useState(fullView);
    useEffect(() => {
        if (localFullView != fullView) {
            dispatch({ type: 'SET_FULL_VIEW_MODE', payload: localFullView });
        }
        if (localDynamicMode != dynamicMode) {
            dispatch({ type: 'SET_DYNAMIC_MODE', payload: localDynamicMode });
        }
    }, [localFullView, dispatch, fullView, localDynamicMode, dynamicMode]);

    const positions = ['defender', 'midfielder', 'forward'].filter(pos => pos !== position);
    const leagues = ['premier_league', 'ligue_1', 'serie_a', 'bundesliga', 'la_liga', 'brasileirao', 'top_5'].filter(nleague => league !== nleague);

    return (
        <div className={styles.page}>
            <Header/>
            <main className={styles.main}>
                <div className={styles.playerDataColumn}>
                    <div className={styles.playerData}>
                        <h1>{playerInfo.name}</h1> 
                        <div className={styles.playerInfo}>
                            <p>{getCountryEmoji(playerInfo.nationality)} {playerInfo.age.toString().slice(0, 2)} years old {getPositionName(playerInfo.position)}</p>
                            <div className={styles.playerBadgeSection}>
                                <Image
                                    className={styles.playerBadge}
                                    src={`/badges/${playerInfo.club}.png`}
                                    alt={`${playerInfo.club} badge`}
                                    width={180}
                                    height={180}
                                />
                            </div>
                            <div className={styles.playerBasicStats}>
                                {position !== "goalkeeper" && <h4>COMPARING TO OTHER</h4>}
                                {position !== "goalkeeper" && <DropdownMenu
                                    dispatch={dispatch}
                                    defaultOption={{ label: position.toUpperCase() + 'S', type: 'SET_POSITION', payload: '', image: `/icons/${position}.png` }}
                                    otherOptions={positions.map(pos => ({ label: pos.toUpperCase() + 'S', type: 'SET_POSITION', payload: pos, image: `/icons/${pos}.png` }))}
                                />}
                                <h4>COMPARING TO {position.toUpperCase()}S FROM</h4>
                                <DropdownMenu
                                    dispatch={dispatch}
                                    defaultOption={{ label: getLeagueName(league).toUpperCase(), type: 'SET_POSITION', payload: '', image: `/leagues/${league}.png` }}
                                    otherOptions={leagues.map(nleague => ({ label: getLeagueName(nleague).toUpperCase(), type: 'SET_LEAGUE', payload: nleague, image: `/leagues/${nleague}.png` }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.playerStatsSection}>
                    <div className={styles.playerStatsUpperSection}>
                        {getHeaderButtons(playerInfo.id, statisticType, position, dispatch)}
                        {statisticType == "profile"
                            ? createModeToggle("DYNAMIC", "ABSOLUTE", dynamicMode, setDynamicMode)
                            : createModeToggle("STANDARD", "COMPACT", localFullView, setLocalFullView)
                        }
                    </div>
                    <div className={styles.playerStatisticsContainer}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
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

function getHeaderButtons(id: string, currentStatType: string, position: string, dispatch: Dispatch<Action>) {
    const createButton = (id: string, label: string) => {
        const className = id === currentStatType ? `${styles.playerStatsHeaderButton} ${styles.playerStatsHeaderButtonActive}` : styles.playerStatsHeaderButton;
        return (<div onClick={() => dispatch({ type: 'SET_STATISTIC_TYPE', payload: id })} className={className}>
            <button className={styles.playerStatsHeaderButtonText}>{label}</button>
        </div>)
    }

    if (position === "goalkeeper") {
        return (
            <div className={styles.playerStatsHeaders}>
                {createButton("profile", "Profile")}
                {createButton("overall", "Overall")}
                {createButton("shot-stopping", "Shot-Stopping")}
                {createButton("distribution", "Distribution")}
                {createButton("sweeping", "Sweeping")}
                <Link href={{ pathname: "/compare", query: { first: id } }} className={`${styles.playerStatsHeaderButton} ${styles.compareHeaderButton}`}>
                <button className={`${styles.playerStatsHeaderButtonText} ${styles.compareHeaderButtonText}`}>Compare</button>
            </Link>
            </div>
        )
    }

    return (
        <div className={styles.playerStatsHeaders}>
            {createButton("profile", "Profile")}
            {createButton("shooting", "Shooting")}
            {createButton("playmaking", "Playmaking")}
            {createButton("possession", "Possession")}
            {createButton("passing", "Passing")}
            {createButton("defending", "Defending")}
            <Link href={{ pathname: "/compare", query: { first: id } }} className={`${styles.playerStatsHeaderButton} ${styles.compareHeaderButton}`}>
                <button className={`${styles.playerStatsHeaderButtonText} ${styles.compareHeaderButtonText}`}>Compare</button>
            </Link>
        </div>
    )
}