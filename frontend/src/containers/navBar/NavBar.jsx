import React from "react";
import { navigation, RouteConstants } from "../../constants/AppConstants";
import Navigation from "../../components/Navigation/Navigation";
import logo from '../../assets/Mascot.svg';
import style from './NavBar.module.css';
import { NavLink } from "react-router-dom";
export default function NavBar(){
    return(
        <div className={style['nav-bar']}>
            <NavLink to={RouteConstants.dashboard} className={style['logo-link']}><img src={logo} alt='logo' className={style['logo']}/></NavLink>
            <div className={style['navigation']}>
                {navigation.map((nav,index)=>{
                    return <Navigation nav={nav} key={index}/>
                })}
            </div>
        </div>
    )
}