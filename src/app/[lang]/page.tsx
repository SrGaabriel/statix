import Image from 'next/image'
import styles from './page.module.css'
import Header from '../components/Header'
import { getDictionary } from './dictionary/dictionaries'

export default async function Home({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return (
    <div>
    <Header dictionary={dictionary}/>
      <main className={styles.main}>

      </main>
    </div>
  )
}