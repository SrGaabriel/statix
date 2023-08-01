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
    const [addButtonClicked, setAddButtonClicked] = useState(false);
    const [isNarrow, setIsNarrow] = useState(false);
    const [firstPlayerRemoved, setFirstPlayerRemoved] = useState(false);
    const [league, setLeague] = useState(firstPlayerInfo?.league ?? 'top_5')
    const [position, setPosition] = useState(firstPlayerInfo?.position ? getPositionNameById(firstPlayerInfo.position) : 'forward')
    const positions = OUTFIELD_POSITIONS.filter(pos => pos !== position);
    const leagues = ['premier_league', 'ligue_1', 'serie_a', 'bundesliga', 'la_liga', 'brasileirao', 'top_5'].filter(nleague => league !== nleague);
    const [clickedDropdown, setClickedDropdown] = useState<string | null>(null);

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
            <div className={styles.otherSection}>
                <div className={styles.otherSectionContainer}>
                    {isNarrow && <span className={styles.pageTitle}>{dictionary.compare.compare_different_players}</span>}
                    {position !== "goalkeeper" && <h4>{`${dictionary.statistics.comparing_to} ${dictionary.other}`.toUpperCase()}</h4>}
                    {position !== "goalkeeper" && <DropdownMenu
                        callback={(option) => setPosition(option.payload)}
                        defaultOption={{ label: getPositionPluralName(dictionary, position).toUpperCase(), payload: '', image: `/icons/${position}.png` }}
                        otherOptions={positions.map(pos => ({ label: getPositionPluralName(dictionary, pos).toUpperCase(), type: 'SET_POSITION', payload: pos, image: `/icons/${pos}.png` }))}
                        isClicked={clickedDropdown === 'position'}
                        setClicked={(clicked) => setClickedDropdown(clicked ? 'position' : null)}
                    />}
                    <h4>{`${dictionary.statistics.comparing_to} ${getPositionPluralName(dictionary, position).toUpperCase()} ${dictionary.from}`.toUpperCase()}</h4>
                    <DropdownMenu
                        callback={(option) => setLeague(option.payload)}
                        defaultOption={{ label: getLeagueName(dictionary, league).toUpperCase(), payload: '', image: `/leagues/${league}.png` }}
                        otherOptions={leagues.map(nleague => ({ label: getLeagueName(dictionary, nleague).toUpperCase(), type: 'SET_LEAGUE', payload: nleague, image: `/leagues/${nleague}.png` }))}
                        isClicked={clickedDropdown === 'league'}
                        setClicked={(clicked) => setClickedDropdown(clicked ? 'league' : null)}
                    />
                    {!error() ? (<div className={styles.compareButtonSection}>
                        <Link href={makeLink()} className={styles.compareButton}>{dictionary.statistics.compare.toUpperCase()}</Link>
                    </div>) : (<div className={styles.compareButtonSection}>
                        <p className={styles.errorText}>{error()}</p>
                    </div>)  
                    }
                </div>
            </div>
            <div className={styles.comparisonContainer}>
                {!isNarrow && <span className={styles.pageTitle}>{dictionary.compare.compare_different_players}</span>}
                <dialog className={styles.addPlayerModal} id="addplayermodal" onClose={() => setAddButtonClicked(false)}>
                    {addButtonClicked && <SearchBox dictionary={dictionary} width={isNarrow ? '350px' : '600px'} height="75px" resultTrigger={(result) => {
                        if (isPlayerAdded(result.id)) {
                            return
                        }
                        setPlayers([...players, result]);
                        setAddButtonClicked(false);
                        const dialog = (document.getElementById(`addplayermodal`) as HTMLDialogElement)
                        if (!dialog.open)
                            return;
                        dialog.close();
                    }}/>}
                </dialog>
                <div className={styles.playerList}>
                    {players.map((player) => renderPlayerCard(player))}
                    {players.length < 3 && <div className={styles.addPlayer}>
                        <h1 className={styles.addPlayerTitle}>{dictionary.compare.add_player.toUpperCase()}</h1>
                        <div className={styles.addPlayerButtonSection}>
                            <button
                                className={styles.addPlayerButton}
                                onClick={() => {
                                    const dialog = (document.getElementById(`addplayermodal`) as HTMLDialogElement)
                                    if (dialog.open)
                                        return;
                                    setAddButtonClicked(true);
                                    dialog.showModal();
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
    function renderPlayerCard(player: any) {
        const clubColors = getClubColors(player.club);
        const gradientStyle: any = {
            '--gradient': `linear-gradient(white, white), linear-gradient(90deg, ${clubColors.primary}, ${clubColors.secondary})`,
        }
        const image = player.has_image ? `/images/${player.id}.png` : `/images/placeholder.png`;
        return (
            <div className={styles.playerCard} style={gradientStyle}>
                <h1 className={styles.playerCardLabel}>{player.name.toUpperCase()}</h1>
                <div className={styles.playerBasicInfoSection}>
                    <Image
                        src={getPlayerImageOrClubBadge(player)}
                        alt={player.name}
                        width={200}
                        height={200}
                    />
                </div>
                <div className={styles.playerRemoveButtonSection}>
                    <button className={styles.playerRemoveButton} onClick={() => {
                        if (firstPlayerInfo && player.id === firstPlayerInfo.id) {
                            setFirstPlayerRemoved(true);
                        }
                        setPlayers(players.filter((p) => p.id !== player.id));
                    }}>Remove</button>
                </div>
            </div>
        )
    }
}

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export default PlayerComparisonContainer;