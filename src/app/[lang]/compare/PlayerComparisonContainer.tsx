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