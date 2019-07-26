import React, { useState } from "react";
import { useGlobalState, useLocale, useCookie } from "./../hooks";
import { getUserInfo } from "../Api/account-api";
const widthResolver = WrappedComponent => {
  // const { cmp: Component } = props;

  return props => {
    const { t, currentLang } = useLocale();
    const [token] = useCookie("reqter_token");
    const [{ userInfo }, dispatch] = useGlobalState();
    const [loading, toggleLoading] = useState(userInfo ? false : true);
    const [error, setError] = useState();
    function refresh() {
      window.location.reload();
    }
    if (!userInfo) {
      getUserInfo()
        .onOk(result => {
          const spaceInfo = result.spaces[0];
          delete result.spaces;
          const userInfo = result;
          dispatch({
            type: "SET_USERINFO",
            value: userInfo,
          });
          dispatch({
            type: "SET_SPACEINFO",
            value: spaceInfo,
          });
          toggleLoading(false);
        })
        .onServerError(result => {
          console.log("server error");
          setError("Internal server error");
          toggleLoading(false);
        })
        .onBadRequest(result => {
          console.log("bad request");
          setError("Bad request");
          toggleLoading(false);
        })
        .unAuthorized(result => {
          console.log("un authorized");
          setError(
            "There is an error which has occured in the request.\ntry again "
          );
          toggleLoading(false);
        })
        .notFound(result => {
          console.log("not found");
          setError(
            "There is an error which has occured in the request.\ntry again "
          );
          toggleLoading(false);
        })
        .onRequestError(result => {
          console.log("request error");
          setError(
            "There is an error which has occured in the request.\ntry again "
          );
          toggleLoading(false);
        })
        .unKnownError(result => {
          console.log("unknown error");
          setError(
            "There is an error which has occured in the request.\ntry again "
          );
          toggleLoading(false);
        })
        .call(token);
    }
    return !loading ? (
      error ? (
        <div className="rosolverError animated fadeIn">
          <i className="icon-empty-box-open icon" />
          <span className="title">Error has occurred!</span>
          <span className="info">{error}</span>
          <button className="btn btn-primary" onClick={refresh}>
            Refresh
          </button>
        </div>
      ) : (
        <WrappedComponent {...props} />
      )
    ) : (
      <div className="loaderBox">
        <div className="loader" />
        {t("LOADING")}...
      </div>
    );
  };
};

export default widthResolver;