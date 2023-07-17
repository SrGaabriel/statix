import SearchBox from './PlayerSearch'
import HeaderButton from './HeaderButton'
import styles from './header.module.css'
import Image from 'next/image'

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.headerLeftHandSide}>
                <Image
                    src="/logo.webp"
                    alt="Statix logo"
                    className={styles.headerLogo}
                    width={200}
                    height={70}
                />
                <HeaderButton>Home</HeaderButton>
                <HeaderButton>Usage</HeaderButton>
                <HeaderButton>F.A.Q</HeaderButton>
            </div>
                <SearchBox
                    height={50}
                    width={300}
                />
        </div>
    )
}