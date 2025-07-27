import React from "react";
import { Route, Routes } from "react-router-dom";
import { RouteConstants } from "./constants/AppConstants";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Asset from "./pages/Asset/Asset";
import Layout from "./pages/Layout";
import PageNotFound from "./pages/PageNotFound";
import ExperienceScore from "./pages/ExperienceScore/ExperienceScore";
import Help from "./pages/Help/Help";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={RouteConstants.home} element={<Layout />}>
          <Route path={RouteConstants.home} element={<Dashboard />} />
          <Route path={RouteConstants.myassets} element={<Asset />} />
          <Route
            path={RouteConstants.experiencescore}
            element={<ExperienceScore />}
          />
          <Route path={RouteConstants.help} element={<Help />} />
          <Route path={RouteConstants.all} element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
