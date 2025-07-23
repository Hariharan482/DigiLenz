import DeviceHealthOverview from "../../components/deviceHealthOverview/DeviceHealthOverview";
import DeviceByAgeChart from "../../components/devicesByAgeChart/DevicesByAgeChart";
import { user } from '../../constants/AppConstants';
import style from './Dashboard.module.css';

export default function Dashboard(){
    return(
        <div className={style['dashboard']}>
            <div className={style['greeting']}>Good Morning, {user}</div>
            <div className={style['dashboard-charts']}>
                <DeviceHealthOverview/>
                <DeviceByAgeChart/>
            </div>
        </div>
    )
}