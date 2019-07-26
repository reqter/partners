import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
//
import "bootstrap/dist/css/bootstrap.css";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme, useLocale, useLayout } from "./hooks";
//
import "./styles/app.scss";
import "animate.css";
//
import Notifies from "./components/Notifies";
import PrivateRoute from "./hoc/PrivateRoute";
//
import withResolver from "./hoc/withResolver";
import Login from "./Pages/Login";
import MainPage from "./Pages/MainPage";
const Signup = lazy(() => import("./Pages/Signup"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Main = withResolver(MainPage);
//
const possibleLangs = {
  en: {
    direction: "ltr"
  },
  fa: {
    direction: "rtl"
  }
};

const App = props => {
  const pathName = window.location.pathname;
  const lang = pathName.split("/")[1];
  let appLang = possibleLangs[lang] ? lang : "fa";
  const direction = possibleLangs[appLang].direction;

  const { setLocale } = useLocale();
  useTheme("theme1");
  useLayout(direction);

  return (
    <StateProvider>
      <LocaleProvider lang={appLang}>
        <BrowserRouter>
          <Suspense fallback={<div>loading...</div>}>
            <Switch>
              <Route
                exact
                key="login"
                path="/:lang/login"
                render={props => <Login {...props} />}
              />
              <Route
                key="signup"
                path="/:lang/signup"
                render={props => <Signup {...props} />}
              />
              <Route
                key="forgotPassword"
                path="/:lang/forgotPassword"
                render={props => <ForgotPassword {...props} />}
              />
              <PrivateRoute
                key="panel"
                path="/:lang"
                render={props => <Main {...props} />}
              />
              <Redirect from="/" to={`/fa/newApplications`} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </LocaleProvider>
      <Notifies />
    </StateProvider>
  );
};

export default App;
