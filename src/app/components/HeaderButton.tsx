import styles from './headerButton.module.css'

export default function HeaderButton({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.headerButton}>
            <a href="/"><button className={styles.headerButtonComponent}>{children}</button></a>
        </div>
    );
}
