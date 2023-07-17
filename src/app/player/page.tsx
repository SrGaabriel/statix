import SearchBox from '../components/PlayerSearch'
import styles from './page.module.css'

export default async function Players() {
    // Search box
    return (
        <div className={styles.main}>
            <h1>Search Box with Autocomplete</h1>
            <SearchBox/>
        </div>
    )
}