import { getPlayerInfo } from "@/app/api/player";
import Header from "../../components/Header";
import { getDictionary } from "../dictionary/dictionaries";
import PlayerComparisonContainer from "./PlayerComparisonContainer";
import styles from './page.module.css'

export default async function Compare({ params, searchParams }: { 
    params: { lang: string },
    searchParams: { first?: string, lang: string }
}) {
    const dictionary = await getDictionary(params.lang);
    const firstInfo = searchParams.first ? await getPlayerInfo(searchParams.first) : null;

    return (
        <div className={styles.page}>
            <Header dictionary={dictionary} style={{ backgroundColor: 'rgb(15, 31, 75)' }}/>
            <main className={styles.main}>
                <PlayerComparisonContainer dictionary={dictionary} firstPlayerInfo={firstInfo}/>
            </main>
        </div>
    )
}

