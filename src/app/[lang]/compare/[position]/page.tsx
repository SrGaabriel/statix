import { getPlayerInfo, playerMultipleProfileFetcher, playerProfileFetcher } from "@/app/api/player"
import Header from "@/app/components/Header";
import styles from './page.module.css'
import PlayerComparisonRadar from "./PlayerComparisonRadar";
import { getDictionary } from "../../dictionary/dictionaries";
import { getLeagueName, getPositionPluralName, getStatisticName } from "@/app/utils/naming";
import Image from "next/image";
import { getClubColors } from "@/app/utils/colors";
import Link from "next/link";
import PlayerComparisonModal from "./PlayerComparisonModal";

export default async function Comparison({ params, searchParams }: {
    params: { position: string, lang: string },
    searchParams: { first: string, second: string, third?: string, fourth?: string, league: string }
}) {
    const dictionary = await getDictionary(params.lang);
    if (!searchParams.first || !searchParams.second) {
        return (<h1>Invalid search parameters</h1>)
    }
    const allPlayersData = await playerMultipleProfileFetcher(
        searchParams.first,
        searchParams.second,
        searchParams.third,
        searchParams.fourth,
        searchParams.league,
        params.position,
        "dynamic"
    );

    const firstPlayerData = allPlayersData[searchParams.first];
    const secondPlayerData = allPlayersData[searchParams.second];
    const thirdPlayerData = searchParams.third ? allPlayersData[searchParams.third || ""] : undefined;
    const fourthPlayerData = searchParams.fourth ? allPlayersData[searchParams.fourth || ""] : undefined;

    const indicators = []
    for (const key in firstPlayerData.values) {
        const value = firstPlayerData.values[key];
        indicators.push({ text: getStatisticName(dictionary, key).toUpperCase(), max: 100 })
    };
    const getValuesFromData = (data: any) => {
        const values = []
        for (const key in data.values) {
            const value = data.values[key];
            values.push(value)
        };
        return values;
    };

    const firstPlayerValues = getValuesFromData(firstPlayerData);
    const secondPlayerValues = getValuesFromData(secondPlayerData);
    const thirdPlayerValues = thirdPlayerData ? getValuesFromData(thirdPlayerData) : undefined;
    const fourthPlayerValues = fourthPlayerData ? getValuesFromData(fourthPlayerData) : undefined;
    const sum = sumArrays(firstPlayerValues, secondPlayerValues, thirdPlayerValues || []);

    const makePlayerListElement = (playerInfo: any, index: number) => {
        const clubColors = getClubColors(playerInfo.club);
        const stripeStyle = {
            borderLeft: `5px solid ${clubColors.primary}`,
        }
        return (<Link href={`/${dictionary.code}/player/${playerInfo.id}`} className={styles.playerListElement} style={stripeStyle}>
            <Image
                src={`/badges/${playerInfo.club}.png`}
                alt={playerInfo.club}
                className={styles.playerListBadge}
                width={20}
                height={20}
            />
            <span>{playerInfo.name.toUpperCase()}</span>
        </Link>)
    }
    const makeReferenceBox = (text: string, icon: string) => {
        return (<div className={styles.referenceBox}>
            <Image
                src={icon}
                alt={icon}
                className={styles.referenceBoxIcon}
                width={24}
                height={24}
            />
            <span className={styles.referenceBoxContent}>{text}</span>
        </div>)
    }

    return (
        <div className={styles.page}>
            <Header dictionary={dictionary}/>
            <main className={styles.main}>
                <div className={styles.otherSection}>
                    <div className={styles.otherSectionContainer}>
                        <h1 className={styles.comparisonTitle}>{dictionary.compare.comparison}</h1>
                        <div className={styles.otherSectionContainerData}>
                            <h3 className={styles.playersTitle}>{dictionary.players}</h3>
                            <ul className={styles.playerList}>
                                {makePlayerListElement(firstPlayerData, 1)}
                                {makePlayerListElement(secondPlayerData, 2)}
                                {thirdPlayerData && makePlayerListElement(thirdPlayerData, 3)}
                                {fourthPlayerData && makePlayerListElement(fourthPlayerData, 4)}
                            </ul>

                            <h3 className={styles.referenceTitle}>{dictionary.compare.reference}</h3>
                            <div className={styles.referenceContainer}>
                                {makeReferenceBox(getPositionPluralName(dictionary, params.position).toUpperCase(), `/icons/${params.position}.png`)}
                                {makeReferenceBox(getLeagueName(dictionary, searchParams.league).toUpperCase(), `/leagues/${searchParams.league}.png`)}
                            </div>

                            <PlayerComparisonModal dictionary={dictionary} type="strengths" color="#2cdb3d"/>
                            <PlayerComparisonModal dictionary={dictionary} type="weaknesses" color="#ff5959"/>
                        </div>
                    </div>
                </div>
                <div className={styles.radarSection}>
                    <PlayerComparisonRadar
                        names={[firstPlayerData.name, secondPlayerData.name, thirdPlayerData?.name, fourthPlayerData?.name]}
                        indicators={indicators}
                        firstPlayerValues={firstPlayerValues}
                        secondPlayerValues={secondPlayerValues}
                        thirdPlayerValues={thirdPlayerValues}
                        fourthPlayerValues={fourthPlayerValues}
                    />
                </div>
            </main>
        </div>
    )
}

function sumArrays(arr1: number[], arr2: number[], arr3: number[]): number[] {
  const maxLength = Math.max(arr1.length, arr2.length, arr3.length);
  const result: number[] = [];

  for (let i = 0; i < maxLength; i++) {
    const sum = (arr1[i] || 0) + (arr2[i] || 0) + (arr3[i] || 0);
    result.push(sum);
  }

  return result;
}