import { useRouter } from 'next/router'
import SearchBox from '../components/PlayerSearch'
import styles from './page.module.css'

export default async function Players() {
    return (
        <div className={styles.main}>
            <h1>{name!!}</h1>
            <h1>Search Box with Autocomplete</h1>
            <SearchBox/>
        </div>
    )
}