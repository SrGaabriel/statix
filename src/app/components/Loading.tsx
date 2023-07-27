import styles from './loading.module.css'

const Loading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.loadingDefault}>
                <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    )
}

export default Loading;