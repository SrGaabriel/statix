import { PlayerInfo, PlayerSuggestion, getPlayerInfo, getPlayerPositionData, getPositionName } from "@/app/api/player";
import styles from "./page.module.css";
import Header from "@/app/components/Header";
import PlayerStatistic, { PlayerStatisticValues } from "./PlayerStatistic";
import { getCountryEmoji } from "@/app/utils/emojis";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
    const playerInfo: PlayerInfo | null = await getPlayerInfo(params.id);
    if (playerInfo == null) {
        return (
            <div>
                <h1>Player not found</h1>
            </div>
        )
    }
    const position = getPositionName(playerInfo.position);
    const data = await getPlayerPositionData(playerInfo.id, playerInfo.position);
    if (data == null)
        throw new Error("Player data not found");
                
    console.log(data);

    return (
        <div className={styles.page}>
            <Header/>
            <main className={styles.main}>
                <div className={styles.playerDataColumn}>
                    <div className={styles.playerData}>
                        <h1>{playerInfo.name}</h1> 
                        <div className={styles.playerInfo}>
                            <p>{getCountryEmoji(playerInfo.nationality)} {playerInfo.age.toString().slice(0, 2)} years old {position}</p>
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
                                <h4>COMPARING TO OTHER</h4>
                                <select className={styles.playerSelectable}>
                                    <option value="1">{position.toUpperCase()+'S'}</option>
                                </select>
                                <h4>COMPARING TO {position.toUpperCase()}S FROM</h4>
                                <select className={styles.playerSelectable}>
                                    <option value="1">BRASILEIRÃO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {createMidfielderStats(data)}
            </main>
        </div>
    )
}

function createMidfielderStats(stats: PlayerMidfielderStats) {
    console.log(stats);
    return (
        <div className={styles.playerStatsSection}>
            <PlayerStatistic label="SHOOTING">
                <PlayerStatisticValues label="Tendency" value={stats.shooting.shooting_tendency}/>
                <PlayerStatisticValues label="Quality" value={stats.shooting.shooting_quality}/>
                <PlayerStatisticValues label="Chances" value={stats.shooting.shooting_chances}/>
            </PlayerStatistic>
            <PlayerStatistic label="DEFENSE">
                <PlayerStatisticValues label="Tendency" value={stats.shooting.shooting_tendency}/>
                <PlayerStatisticValues label="Quality" value={stats.shooting.shooting_quality}/>
                <PlayerStatisticValues label="Chances" value={stats.shooting.shooting_chances}/>
            </PlayerStatistic>
        </div>
    )
}