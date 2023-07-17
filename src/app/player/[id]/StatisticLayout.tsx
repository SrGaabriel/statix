import { PlayerInfo } from '@/app/api/player';
import styles from './page.module.css'
import { getCountryEmoji } from '@/app/utils/emojis';
import Header from '@/app/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { getPositionName } from '@/app/utils/defaults';

interface Properties {
    info: PlayerInfo,
    data: any;
    position: string;
    children: React.ReactNode;
}

export default function StatisticLayout({ info, data, position, children }: Properties) {
    if (data == null)
        throw new Error("Player data not found");

    return (
        <div className={styles.page}>
            <Header/>
            <main className={styles.main}>
                <div className={styles.playerDataColumn}>
                    <div className={styles.playerData}>
                        <h1>{info.name}</h1> 
                        <div className={styles.playerInfo}>
                            <p>{getCountryEmoji(info.nationality)} {info.age.toString().slice(0, 2)} years old {getPositionName(info.position)}</p>
                            <div className={styles.playerBadgeSection}>
                                <Image
                                    className={styles.playerBadge}
                                    src={`/badges/${info.club}.png`}
                                    alt={`${info.club} badge`}
                                    width={180}
                                    height={180}
                                />
                            </div>
                            <div className={styles.playerBasicStats}>
                                <h4>COMPARING TO OTHER</h4>
                                <select className={styles.playerSelectable}>
                                    <option key={position}>{position.toUpperCase()}S</option>
                                    {(["forward", "midfielder", "defender"]).map((pos) => (
                                        pos !== position && <option key={pos}>{pos.toUpperCase()}S</option>
                                    ))}
                                </select>
                                <h4>COMPARING TO {position.toUpperCase()}S FROM</h4>
                                <select className={styles.playerSelectable}>
                                    <option value="1"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.playerStatsSection}>
                    {getHeaderButtons(info, position)}
                    {children}
                </div>
                    
            </main>
        </div>
    )
}

function getHeaderButtons(info: PlayerInfo, position: string) {
    if (position === "goalkeeper") {
        return (
            <div className={styles.playerStatsHeaders}>
                <Link href={`/player/${info.id}/${position}/overall`} className={styles.playerStatsHeaderButton}>
                    <button className={styles.playerStatsHeaderButtonText}>Overall</button>
                </Link>
                <Link href={`/player/${info.id}/${position}/shot-stopping`} className={styles.playerStatsHeaderButton}>
                    <button className={styles.playerStatsHeaderButtonText}>Shot-Stopping</button>
                </Link>
                <Link href={`/player/${info.id}/${position}/distribution`} className={styles.playerStatsHeaderButton}>
                    <button className={styles.playerStatsHeaderButtonText}>Distribution</button>
                </Link>
                <Link href={`/player/${info.id}/${position}/sweeping`} className={styles.playerStatsHeaderButton}>
                    <button className={styles.playerStatsHeaderButtonText}>Sweeping</button>
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.playerStatsHeaders}>
            <Link href={`/player/${info.id}/${position}/shooting`} className={styles.playerStatsHeaderButton}>
                <button className={styles.playerStatsHeaderButtonText}>Shooting</button>
            </Link>
            <Link href={`/player/${info.id}/${position}/playmaking`} className={styles.playerStatsHeaderButton}>
                <button className={styles.playerStatsHeaderButtonText}>Playmaking</button>
            </Link>
            <Link href={`/player/${info.id}/${position}/possession`} className={styles.playerStatsHeaderButton}>
                <button className={styles.playerStatsHeaderButtonText}>Possession</button>
            </Link>
            <Link href={`/player/${info.id}/${position}/passing`} className={styles.playerStatsHeaderButton}>
                <button className={styles.playerStatsHeaderButtonText}>Passing</button>
            </Link>
            <Link href={`/player/${info.id}/${position}/defending`} className={styles.playerStatsHeaderButton}>
                <button className={styles.playerStatsHeaderButtonText}>Defending</button>
            </Link>
        </div>
    )
}