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
                    startAngle: 0,
                    diameter: 600,
                    percentage: false,
                    steps: 10,
                    datasets: [
                        {
                            name: 'Dataset 1',
                            data: [100, 80, 60, 40, 25, 30, 40, 50, 60, 70, 80, 90],
                            lineColor: '#1dc75e',
                            areaColor: '#33eb42'
                        },
                        /*{
                            name: 'Dataset 2',
                            data: [30, 20, 40, 60, 80, 100, 80, 60, 30, 60, 80, 100],
                            lineColor: '#115ae2',
                            areaColor: '#115ae297'
                        },
                        {
                            name: 'Dataset 3',
                            data: [100, 80, 60, 40, 20, 30, 40, 50, 60, 70, 80, 90],
                            lineColor: '#ec584e',
                            areaColor: '#ec584e97'
                        }*/
                    ],
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
                        },
                        {
                            text: 'G',
                            max: 100
                        },
                        {
                            text: 'H',
                            max: 100
                        },
                        {
                            text: 'I',
                            max: 100
                        },
                        {
                            text: 'J',
                            max: 100
                        },
                        {
                            text: 'K',
                            max: 100
                        },
                        {
                            text: 'L',
                            max: 100
                        }
                    ],
                    categories: [
                        {
                            name: 'Shooting',
                            color: '#ff3b18',
                            space: 4
                        },
                        {
                            name: 'Playmaking',
                            color: '#013594',
                            space: 4
                        },
                        {
                            name: 'Possession',
                            color: '#00a3e0',
                            space: 4
                        }
                    ]
                }}/>
            </div>
        </main>
    )
}