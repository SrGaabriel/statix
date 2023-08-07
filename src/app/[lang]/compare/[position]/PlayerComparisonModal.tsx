'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Properties {
    dictionary: any,
    type: string,
    color: string
}

const PlayerComparisonModal: React.FC<Properties> = ({dictionary, type, color}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const name = dictionary.compare[type]
    const stripeStyle: any = {
        '--stripeColor': color
    }

    return (<>
        <h3 className={styles.referenceTitle}>{name}</h3>

        <button className={styles.comparisonButton} style={stripeStyle} onClick={() => {
            const dialog = document.getElementById(`${type}-dialog`) as HTMLDialogElement;
            if (dialog.open)
                return;
            setModalOpen(true);
            dialog.showModal(); 
        }}>
            <div className={styles.comparisonButtonStripe} style={stripeStyle}>

            </div>
            {dictionary.compare[`click_to_see_${type}`]}
        </button>
        <dialog id={`${type}-dialog`} className={styles.comparisonDialog} onClose={() => setModalOpen(false)}>
            {modalOpen && <div className={styles.comparisonDialogContainer}>
                <div className={styles.comparisonDialogContent}>
                    <h1 className={styles.comparisonDialogTitle}>{name}</h1>
                </div>
            </div>}
        </dialog>
    </>)
}

export default PlayerComparisonModal;