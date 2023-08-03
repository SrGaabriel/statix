import { getPlayerInfo, playerProfileFetcher } from "@/app/api/player"
import Header from "@/app/components/Header";
import styles from './page.module.css'
import PlayerComparisonRadar from "./PlayerComparisonRadar";
import { getDictionary } from "../../dictionary/dictionaries";
import { getLeagueName, getPositionPluralName, getStatisticName } from "@/app/utils/naming";
import Image from "next/image";
import { getClubColors } from "@/app/utils/colors";
import Link from "next/link";

export default async function Comparison({ params, searchParams }: {
    params: { position: string, lang: string },
    searchParams: { first: string, second: string, third?: string, league: string }
}) {
    const dictionary = await getDictionary(params.lang);
    if (!searchParams.first || !searchParams.second) {
        return (<h1>Invalid search parameters</h1>)
    }
    const firstInfo = await getPlayerInfo(searchParams.first);
    const secondInfo = await getPlayerInfo(searchParams.second);
    const thirdInfo = searchParams.third ? await getPlayerInfo(searchParams.third) : null;
    if (!firstInfo || !secondInfo || (searchParams.third && !thirdInfo)) {
        return (<h1>Invalid search parameters</h1>)
    }

    const firstData = await playerProfileFetcher(firstInfo.id, searchParams.league, params.position, "dynamic");
    const secondData = await playerProfileFetcher(secondInfo.id, searchParams.league, params.position, "dynamic");
    const thirdData = thirdInfo ? await playerProfileFetcher(thirdInfo.id, "top_5", params.position, "dynamic") : null;

    const indicators = firstData.values.map((value: any) => ({ text: getStatisticName(dictionary, value.type).toUpperCase(), max: 100 }));
    const getValuesFromData = (data: any) => data.values.map((value: any) => value.value) as number[];

    const firstPlayerValues = getValuesFromData(firstData);
    const secondPlayerValues = getValuesFromData(secondData);
    const thirdPlayerValues = thirdData ? getValuesFromData(thirdData) : undefined;
    const sum = sumArrays(firstPlayerValues, secondPlayerValues, thirdPlayerValues || []);

    const strengths = []
    const weaknesses = []
    for (let i = 0; i < sum.length; i++) {
        const average_attribute = sum[i]/(thirdInfo ? 3 : 2)
        if (average_attribute > 80) {
            strengths.push(indicators[i].text)
        } else if (average_attribute < 60) {
            weaknesses.push(indicators[i].text)
        }
    }
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
                                {makePlayerListElement(firstInfo, 1)}
                                {makePlayerListElement(secondInfo, 2)}
                                {thirdInfo && makePlayerListElement(thirdInfo, 3)}
                            </ul>

                            <h3 className={styles.referenceTitle}>{dictionary.compare.reference}</h3>
                            <div className={styles.referenceContainer}>
                                {makeReferenceBox(getPositionPluralName(dictionary, params.position).toUpperCase(), `/icons/${params.position}.png`)}
                                {makeReferenceBox(getLeagueName(dictionary, searchParams.league).toUpperCase(), `/leagues/${searchParams.league}.png`)}
                            </div>

                            <h3 className={styles.referenceTitle}>{dictionary.compare.strengths.toUpperCase()}</h3>
                            <div className={styles.strengthsContainer}>
                                <span>Click</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.radarSection}>
                    <PlayerComparisonRadar
                        names={[firstInfo.name, secondInfo.name, thirdInfo?.name]}
                        indicators={indicators}
                        firstPlayerValues={firstPlayerValues}
                        secondPlayerValues={secondPlayerValues}
                        thirdPlayerValues={thirdPlayerValues}/
                    >
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