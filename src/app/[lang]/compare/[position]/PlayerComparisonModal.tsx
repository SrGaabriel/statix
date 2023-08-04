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
    return (<>
        <h3 className={styles.referenceTitle}>{dictionary.compare.strengths.toUpperCase()}</h3>
        
        <button className={styles.comparisonButton} style={{ '--stripeColor': color }} onClick={() => {
            const dialog = document.getElementById(`${type}-dialog`) as HTMLDialogElement;
            if (dialog.open)
                return;
            setModalOpen(true);
            dialog.showModal(); 
        }}>
            {dictionary.compare.click_to_see_strengths}
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