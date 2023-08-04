'use client'

import styles from './page.module.css';
import { getClubColors } from '@/app/utils/colors';
import Link from 'next/link';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { PlayerInfo } from '@/app/api/player';
import SearchBox from '@/app/components/PlayerSearch';
import { OUTFIELD_POSITIONS, getLeagueName, getPositionNameById, getPositionPluralName } from '@/app/utils/naming';
import DropdownMenu from '@/app/components/DropdownMenu';
import { getPlayerImageOrClubBadge } from '@/app/utils/images';
import Image from 'next/image';

interface Properties extends HTMLAttributes<HTMLDivElement> {
    dictionary: any,
    firstPlayerInfo: PlayerInfo | null
}

const PlayerComparisonContainer: React.FC<Properties> = ({ dictionary, firstPlayerInfo = null }) => {
    const [players, setPlayers] = useState<any[]>([]);
    const [isNarrow, setIsNarrow] = useState(false);
    const [firstPlayerRemoved, setFirstPlayerRemoved] = useState(false);
    const [league, setLeague] = useState(firstPlayerInfo?.league ?? 'top_5')
    const [position, setPosition] = useState(firstPlayerInfo?.position ? getPositionNameById(firstPlayerInfo.position) : 'forward')
    const leagues = ['premier_league', 'ligue_1', 'serie_a', 'bundesliga', 'la_liga', 'brasileirao', 'top_5'];

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1200px)");
        const onChange = () => setIsNarrow(!!mql.matches);
    
        mql.addListener(onChange);
        setIsNarrow(mql.matches);
    
        return () => mql.removeListener(onChange);
      }, []);

    if (players.length === 1 && getPositionNameById(players[0].position) !== position) {
        setPosition(getPositionNameById(players[0].position));
    }
    if (players.length === 1 && players[0].league !== league) {
        setLeague(players[0].league);
    }
    const isPlayerAdded = (id: string) => players.some((p) => p.id === id)
    if (firstPlayerInfo && !isPlayerAdded(firstPlayerInfo.id) && !firstPlayerRemoved) {
        setPlayers([...players, firstPlayerInfo!!])
    }

    const makeLink = () => {
        let link = `./compare/${position}?first=${players[0].id}&second=${players[1].id}&league=${league}`;
        if (players.length === 3)
            link += `&third=${players[2].id}`;
        return link;
    }
    // 
    const hasGoalkeeper = players.some((p) => p.position === 'GK');
    if (hasGoalkeeper && position !== 'goalkeeper') {
        setPosition('goalkeeper');
    } else if (!hasGoalkeeper && position === 'goalkeeper') {
        setPosition('forward')
    }

    const error = (): string | null => {
        if (players.length < 2) {
            return dictionary.compare.add_at_least_two_players;
        }
        if (hasGoalkeeper && !players.every((p) => p.position === 'GK')) {
            return dictionary.compare.goalkeeper_and_outfield_players;
        }
        return null;
    }

    return (
        <div className={styles.totalContainer}>
            <div className={styles.upperContainer}>
                <div className={styles.playerContainer}>
                    {players.map((player) => renderPlayerCard(player))}
                    {players.length < 4 && <div className={`${styles.playerCardModel} ${styles.addPlayer}`}>
                        <h3 className={styles.addPlayerButtonText}>{dictionary.compare.add_player}</h3>
                        <button className={styles.addPlayerButton} onClick={() => {
                            const modal = document.getElementById('addModal') as HTMLDialogElement;
                            modal.showModal();
                        }}>+</button>
                        <dialog id="addModal" className={styles.addPlayerButtonModal}>
                            <SearchBox
                                width={isNarrow ? '300px' : '800px'}
                                height={isNarrow ? '80px' : '100px'}
                                dictionary={dictionary}
                                resultTrigger={(player) => {
                                    setPlayers([...players, player]);
                                    const modal = document.querySelector(`.${styles.addPlayerButtonModal}`) as HTMLDialogElement;
                                    modal.close();
                                }}
                            />
                        </dialog>
                    </div>}
                </div>
                <div className={styles.leaguesContainer}>
                    {leagues.map((mappingLeague) => {
                        const classNames = mappingLeague === league ? `${styles.leagueButton} ${styles.selectedButton}` : styles.leagueButton;
                        return (
                            <div key={mappingLeague} className={classNames} onClick={() => setLeague(mappingLeague)}>
                                <Image src={`/leagues/${mappingLeague}.png`} alt={`${mappingLeague} icon`} width={30} height={30} />
                                <span>{getLeagueName(dictionary, mappingLeague)}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.lowerSection}>
                <div className={styles.positionContainer}>
                    {OUTFIELD_POSITIONS.map((pos) => {
                        const classNames = pos === position ? `${styles.positionButton} ${styles.selectedButton}` : styles.positionButton;
                        return (
                            <div key={pos} className={classNames} onClick={() => setPosition(pos)}>
                                <Image src={`/icons/${pos}.png`} alt={`${pos} icon`} className={styles.whiteIcon} width={30} height={30} />
                                <span>{getPositionPluralName(dictionary, pos)}</span>
                            </div>
                        )
                    })}
                </div>
                {!error ? <Link href={makeLink()} className={styles.finalButton}>
                    COMPARE
                </Link> : <div className={styles.errorDiv}>
                    {error()}
                </div>}
            </div>
        </div>
    )
    function renderPlayerCard(player: any) {
        const clubColors = getClubColors(player.club);
        const gradientStyle: any = {
            '--gradient': `linear-gradient(white, white), linear-gradient(90deg, ${clubColors.primary}, ${clubColors.secondary})`,
        }
        const image = player.has_image ? `/images/${player.id}.png` : `/images/placeholder.png`;
        const removeId = `removeButton-${player.id}`;
        return (
            <div
                onMouseEnter={() => {
                    const removeButton = document.getElementById(removeId) as HTMLButtonElement;
                    removeButton.style.opacity = '1';
                    removeButton.style.height = '12%';
                }}
                onMouseLeave={() => {
                    const removeButton = document.getElementById(removeId) as HTMLButtonElement;
                    removeButton.style.opacity = '0';
                    removeButton.style.height = '0';
                }}
                className={`${styles.playerCardModel} ${styles.actualPlayerCard}`}
                style={gradientStyle}
            >
                <div className={styles.actualPlayerCardData}>
                    <h1 className={styles.playerCardLabel}>{player.name.toUpperCase()}</h1>
                    <div className={styles.playerBasicInfoSection}>
                        <Image
                            src={getPlayerImageOrClubBadge(player)}
                            className={styles.playerImage}
                            alt={player.name}
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
                <button id={removeId} className={styles.removeButton} onClick={() => {
                    if (player.id === firstPlayerInfo?.id) {
                        setFirstPlayerRemoved(true);
                    }
                    if (players.length === 1 && player.position === 'GK') {
                        setPosition('forward');
                    }
                    setPlayers(players.filter((p) => p.id !== player.id));
                }}>
                    REMOVE
                </button>
            </div>
        )
    }
}

export default PlayerComparisonContainer;