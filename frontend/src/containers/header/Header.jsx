import React from "react";
import style from "./Header.module.css";
import cdwlogo from "../../assets/cdw-logo.webp";
export default function Header() {
  return (
    <div className={style["header"]}>
      <span className={style["material-symbols-outlined"]}>settings</span>
      <span className={style["material-symbols-outlined"]}>notifications</span>
      <img src={cdwlogo} className={style["profile"]} alt="logo"/>
    </div>
  );
}
