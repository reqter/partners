import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
//
import SideBar from "./components/SideBar";
import "./styles.scss";
//
import PrivateRoute from "./../../hoc/PrivateRoute";
const NewApplications = lazy(() => import("./../NewApplications"));
const Profile = lazy(() => import("./../Profile"));
//
const MainPage = props => {
  return (
    <div className="mainPage">
      <div className="mainPage__left">
        <SideBar links={[]} />
      </div>
      <div className="mainPage__right">
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute
              key="profile"
              path="/:lang/profile"
              render={props => <Profile {...props} />}
            />
            <PrivateRoute
              key="newApplications"
              path="/:lang/newApplications"
              render={props => <NewApplications {...props} />}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};
export default MainPage;
