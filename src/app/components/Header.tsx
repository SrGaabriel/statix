'use client'

import Link from 'next/link'
import styles from './header.module.css'
import React, { HTMLAttributes } from 'react'
import SearchBox from './PlayerSearch'
import { usePathname, useSearchParams } from 'next/navigation'

interface Properties extends HTMLAttributes<HTMLDivElement> {
    dictionary: any,
    style?: any
}

const Header: React.FC<Properties> = ({dictionary, style = {}}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const otherCode = dictionary.code == 'en' ? 'pt' : 'en';
    return (
        <div className={styles.header} style={style}>
            <div className={styles.headerComponents}>
                <div className={styles.headerSide}>
                    {makeHeaderLabel(dictionary.code, 'Home', '/')}
                    {makeHeaderLabel(dictionary.code, dictionary.statistics.compare, '/compare')}
                    {makeHeaderLabel(dictionary.code, 'F.A.Q', '/faq')}
                    {makeHeaderLabel(dictionary.code, dictionary.header.contact, '/contact')}
                </div>
                <div className={styles.headerSide}>
                    <Link
                        href={`${pathname.replace(`/${dictionary.code}`, `/${otherCode}`)}?${searchParams.toString()}`}
                        className={`${styles.headerLabel} ${styles.languageButtton}`}
                    >
                        {dictionary.header.language}
                    </Link>
                    <div>
                        <SearchBox dictionary={dictionary} height="40px" width="350px" style={{ margin: '8px 0' }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const makeHeaderLabel = (code: string, name: string, href: string) => {
    return (
        <Link href={`/${code}${href}`} className={styles.headerLabel}>{name}</Link>
    )
}

export default Header;