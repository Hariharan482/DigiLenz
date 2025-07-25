import React from "react";
import style from './Header.module.css';
export default function Header(){
    return(
        <div className={style['header']}>
            <span className={style['material-symbols-outlined']}>settings</span>
            <span className={style['material-symbols-outlined']}>notifications</span>
            <div className={style['profile']}></div>
        </div>
    )
}