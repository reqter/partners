import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
//
import "bootstrap/dist/css/bootstrap.css";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme } from "./hooks";
//
import "./styles/app.scss";
import "animate.css";
//
import { storageManager } from "./services";
import setAuthorizationToken from "./utils/setAuthorizationToken";
import Notifies from "./components/Notifies";
import PrivateRoute from "./hoc/PrivateRoute";
//
import withResolver from "./hoc/withResolver";
import Login from "./Pages/Login";
import MainPage from "./Pages/MainPage";
import AxiosInitializer from "utils/axiosInitializer";
const Signup = lazy(() => import("./Pages/Signup"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Upsert = lazy(() => import("./Pages/UpsertContent"));
const Main = withResolver(MainPage);
const AddOffer = withResolver(Upsert);
const ViewRequest = withResolver(Upsert);
//
const token = storageManager.getItem("partner_token");
if (token) {
  setAuthorizationToken(token);
}
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
  useTheme("theme1");

  const pathName = window.location.pathname;
  const lang = pathName.split("/")[1];
  let appLang = possibleLangs[lang] ? lang : "fa";
  const spaceId = pathName.split("/")[2];

  return (
    <StateProvider spaceId={spaceId}>
      <LocaleProvider lang={appLang}>
        <AxiosInitializer spaceId={spaceId}>
          <BrowserRouter basename={`/${appLang}/${spaceId}`}>
            <Suspense fallback={<div />}>
              <Switch>
                <Route
                  exact
                  key="login"
                  path="/login"
                  render={props => <Login {...props} />}
                />
                <Route
                  key="signup"
                  path="/signup"
                  render={props => <Signup {...props} />}
                />
                <Route
                  key="forgotPassword"
                  path="/forgotPassword"
                  render={props => <ForgotPassword {...props} />}
                />
                <PrivateRoute
                  key="viewRequest"
                  path="/request/view/:id"
                  render={props => <ViewRequest {...props} />}
                />
                <PrivateRoute
                  key="addOffer"
                  path="/offer/new/:id"
                  render={props => <AddOffer {...props} />}
                />
                <PrivateRoute
                  key="panel"
                  path=""
                  render={props => <Main {...props} />}
                />
                <Redirect from="/" to={`/notFound`} />
                {/* <Route component={NotFound} /> */}
              </Switch>
            </Suspense>
          </BrowserRouter>
          <Notifies />
        </AxiosInitializer>
      </LocaleProvider>
    </StateProvider>
  );
};

export default App;
