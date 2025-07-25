import React from 'react';
import style from './ExperienceScoreCard.module.css';
export default function ExperienceScore({label, value}) {
    return (
        <div className={style['experience-score-card']}>
            <div className={style['score-label']}>{label}</div>
            <div className={style['score-value']}>{value}</div>
        </div>
    );

}