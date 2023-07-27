'use client'

import Link from 'next/link';
import Image from 'next/image';
import styles from './dropdownMenu.module.css'
import { Dispatch, useState } from 'react';
import { Action } from '@/app/[lang]/player/[id]/StatisticContext';

interface Properties {
    callback: (option: DropdownOption) => void,
    defaultOption: DropdownOption,
    otherOptions: DropdownOption[],
}

interface DropdownOption {
    label: string,
    payload: string,
    image?: string;
}

const DropdownMenu: React.FC<Properties> = ({ callback, defaultOption, otherOptions }) => {
    const [isClicked, setClicked] = useState(false)

    return (
        <div className={styles.statisticDropdownMenu} onClick={() => setClicked(!isClicked)}>
            <div className={`${styles.defaultOption} ${styles.unselectable}`}>
                {defaultOption.image && <Image src={defaultOption.image} alt={`${defaultOption.label} icon`} width={16} height={16}/>}
                <p className={styles.optionLabel}>{defaultOption.label}</p>
                <Image src="/icons/dropdown.png" alt="Dropdown" width={32} height={32} className={styles.dropdownIcon}/>
            </div>
            {isClicked && <div className={styles.otherOptions}>
                {otherOptions.map(option => (
                    <div
                        key={option.label}
                        onClick={() => callback(option)}
                        className={`${styles.otherOption} ${styles.unselectable}`}
                    >
                        {option.image && <Image src={option.image} alt={`${option.label} icon`} width={16} height={16}/>}
                        <p className={styles.optionLabel}>{option.label}</p>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default DropdownMenu;