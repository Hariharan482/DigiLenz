import React, {useState,useEffect} from "react";
import style from "./Asset.module.css";
import AssetActions from "../../components/assetActions/AssetActions";
import AssetList from "../../components/assetList/AssetList";
import { BACKEND_BASE_URL } from "../../constants/ApiConstants";

const rowsPerPage = 10;

export default function Asset() {

    const [page, setPage] = useState(1);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
      const fetchAssets = async () => {
        try {
          const response = await fetch(
            `${BACKEND_BASE_URL}/assets/list?page=${page}&page_size=${rowsPerPage}`,
          );
          const data = await response.json();
          setAssets(data);
        } catch (error) {
          console.error("Failed to fetch asset data:", error);
        }
      };
  
      fetchAssets();
    }, [page]);

  return (
    <div className={style.assetPage}>
      <AssetActions active={assets.active_count} inactive={assets.inactive_count}/>
      <AssetList assets={assets.assets} page={page} setPage={setPage} totalPages={assets.total_pages}/>
    </div>
  );
}
