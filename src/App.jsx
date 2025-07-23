import {Route, Routes} from 'react-router-dom';
import { RouteConstants } from './constants/AppConstants';
import './App.css';
import Dashboard from './pages/Dashboard';
import Asset from './pages/Asset';
import Layout from './pages/Layout';
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <div className='app'>
     <Routes>
        <Route path={RouteConstants.home} element={<Layout/>}>
          <Route path={RouteConstants.dashboard} element={<Dashboard/>}/>
          <Route path={RouteConstants.myassets} element={<Asset/>}/>
          <Route path={RouteConstants.experiencescore} element={<Asset/>}/>
          <Route path={RouteConstants.reports} element={<Asset/>}/>
          <Route path={RouteConstants.alerts} element={<Asset/>}/>
          <Route path={RouteConstants.settings} element={<Asset/>}/>
          <Route path={RouteConstants.help} element={<Asset/>}/>
          <Route path={RouteConstants.all} element={<PageNotFound/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
