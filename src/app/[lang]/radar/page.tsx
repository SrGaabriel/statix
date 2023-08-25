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
                <Radar/>
            </div>
        </main>
    )
}