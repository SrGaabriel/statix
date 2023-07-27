'use client'

import Link from 'next/link'
import SearchBox from './PlayerSearch'
import styles from './header.module.css'
import Image from 'next/image'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { getLanguageEmoji, getLanguageName } from '../utils/naming'
import { usePathname, useSearchParams } from 'next/navigation'

interface Properties extends HTMLAttributes<HTMLDivElement> {
    dictionary: any
}

const Header: React.FC<Properties> = ({dictionary}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNarrow, setNarrow] = useState(false);
    const [currentlyOpenMenu, setCurrentlyOpenMenu] = useState<string | null>(null);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1100px)");
        const onChange = () => setNarrow(!!mql.matches);
    
        mql.addListener(onChange);
        setNarrow(mql.matches);
    
        return () => mql.removeListener(onChange);
    }, [isNarrow])

    const makeLabeledButton = (label: string, href: string) => {
        return (
            <Link href={href} className={styles.headerButton}>
                <span className={styles.headerButtonComponent}>{label}</span>
            </Link>
        )
    }
    const otherLanguage = dictionary.code == 'en' ? 'pt' : 'en';

    if (!isNarrow) {
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
                    {makeLabeledButton('Home', `/${dictionary.code}/`)}
                    {makeLabeledButton(dictionary.statistics.compare, `/${dictionary.code}/compare`)}
                    {makeLabeledButton('F.A.Q', `/${dictionary.code}/faq`)}
                </div>
                <Link className={styles.languageSection} href={`${pathname.replace(dictionary.code, otherLanguage)}?${searchParams.toString()}`}>
                    <span className={styles.language}>{getLanguageEmoji(dictionary.code)} {dictionary.languages[dictionary.code]}</span>
                </Link>
                <SearchBox
                    dictionary={dictionary}
                    height="50px"
                    width="400px"
                />
            </div>
        )
    } else {
        return (
            <div className={styles.header}>
                <div className={styles.headerLeftHandSide}>
                    <Image
                        src="/icons/menu.svg"
                        alt="Menu"
                        className={styles.menuLogo}
                        width={32}
                        height={32}
                        onClick={() => {
                            setCurrentlyOpenMenu(currentlyOpenMenu ? null : 'menu');
                        }}
                    />
                    <Link href={`/${dictionary.code}/`} className={styles.homeLogoLink}>
                        <Image
                            src="/icons/home.svg"
                            alt="Home"
                            width={32}
                            height={32}
                        />
                    </Link>
                </div>
                <Image
                    src="/icons/search.svg"
                    alt="Search"
                    className={styles.searchLogo}
                    width={32}
                    height={32}
                    onClick={() => {
                        setCurrentlyOpenMenu(currentlyOpenMenu ? null : 'search');
                    }}
                />
                {currentlyOpenMenu == 'menu' && <div className={styles.menu}>
                    <Link href={`/${dictionary.code}/`} className={styles.menuButton}>Home</Link>
                    <Link href={`/${dictionary.code}/compare`} className={styles.menuButton}>Compare</Link>
                    <Link href={`/${dictionary.code}/faq`} className={styles.menuButton}>F.A.Q</Link>
                </div>}
                {currentlyOpenMenu == 'search' && <SearchBox dictionary={dictionary} width="600px" height="70px"/>}
            </div>
        )
    }
}

export default Header;