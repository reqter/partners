import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCookie, useLocale } from "../hooks";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentLang } = useLocale();
  const [token] = useCookie("partner_token");
  return token ? (
    <Route {...rest} />
  ) : (
    <Route
      render={props => (
        <Redirect
          to={{
            pathname: `/${currentLang}/login`,
            state: { from: props.location }
          }}
        />
      )}
    />
  );
};

export default PrivateRoute;
