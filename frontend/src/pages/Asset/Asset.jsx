import React from "react";
import style from "./Asset.module.css";
import AssetActions from "../../components/assetActions/AssetActions";
import AssetList from "../../components/assetList/AssetList";

export default function Asset() {
  return (
    <div className={style.assetPage}>
      <AssetActions />
      <AssetList />
    </div>
  );
}
