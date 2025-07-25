import React from "react";
import style from './ExpericenceScore.module.css';
import ExperienceScoreCard from "../../components/experienceScoreCard/ExperienceScoreCard";
import AssetScoreList from "../../components/assetScoreList/AssetScoreList";
export default function ExperienceScore(){
    return(
        <div className={style['experience-score-container']}>
            <div className={style['experience-score-heading']}>Device Experience Score</div>
            <div className={style['experience-score']}>
                <ExperienceScoreCard label="Excellent Devices" value="1" />
                <ExperienceScoreCard label="Need Attention" value="0" />
            </div>
            <AssetScoreList/>
        </div>
    )
}