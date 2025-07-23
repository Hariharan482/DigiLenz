import { Outlet } from "react-router-dom";
import Header from "../containers/header/Header";
import NavBar from "../containers/navBar/NavBar";

export default function Layout(){
    return(
        <>
            <NavBar/>
            <div style={{width: '84%'}}>
                <Header/>
                <Outlet/>
            </div>
        </>
    )
}