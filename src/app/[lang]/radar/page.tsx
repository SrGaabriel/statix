import Header from "@/app/components/Header";
import { getDictionary } from "../dictionary/dictionaries";
import styles from './page.module.css'
import Radar from "./Radar";

export default async function Page({ params }: { params: { lang: string } }) {
    const dictionary = await getDictionary(params.lang);
    return (
        <main className={styles.main}>
            <Header dictionary={dictionary}/>
            <div className={styles.container}>
                <Radar config={{
                    data: [20, 40, 60, 80, 45, 100],
                    labels: [
                        {
                            text: 'A',
                            max: 100
                        },
                        {
                            text: 'B',
                            max: 100
                        },
                        {
                            text: 'C',
                            max: 100
                        },
                        {
                            text: 'D',
                            max: 100
                        },
                        {
                            text: 'E',
                            max: 100
                        },
                        {
                            text: 'F',
                            max: 100
                        }
                    ]
                }}/>
            </div>
        </main>
    )
}