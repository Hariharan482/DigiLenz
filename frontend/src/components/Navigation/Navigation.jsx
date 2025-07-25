import React from "react";
import {NavLink} from 'react-router-dom';
import { RouteConstants,icons } from '../../constants/AppConstants';
import style from './Navigation.module.css';
export default function Navigation({nav}){
    return(
            <NavLink to={RouteConstants[nav.toLowerCase().replace(/\s/g, '')]} className={({isActive})=>(isActive ? style['active-link']:style['link'])}>
                <span className={style['material-symbols-outlined']}>{icons[nav.toLowerCase().replace(/\s/g, '')]}</span>
                {nav}
            </NavLink>
    )
}