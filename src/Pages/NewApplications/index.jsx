import React, { useEffect, useState, useRef } from "react";
import { useGlobalState, useLocale } from "../../hooks";
import { getNewRequests } from "../../Api/main-api";
import "./styles.scss";

import Alert from "../../components/PopupAlert";
import CircleSpinner from "../../components/CircleSpinner";
import SquareSpinner from "../../components/SquareSpinner";
import Image from "../../components/Image";
import DateFormatter from "../../components/DateFormatter";
import { Empty, Wrong } from "../../components/Commons/ErrorsComponent";
import ItemSkeleton from "./ItemSkeleton";
import Item from "./Item";

const NewApplications = props => {
  const { appLocale, t, currentLang } = useLocale();

  const pageTitle = t("HOME_SIDE_NAV_FIRST");
  const pageDescription = t("HOME_SIDE_NAV_FIRST_DESC");

  let didCancel = false;
  const dataLanguage = "en";
  //#region controller
  const [{ spaceInfo }, dispatch] = useGlobalState();

  const [spinner, toggleSpinner] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [alertData, setAlertData] = useState();
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    loadRequests();
    return () => {
      didCancel = true;
    };
  }, []);

  function loadRequests() {
    getNewRequests()
      .onOk(result => {
        if (!didCancel) {
          toggleSpinner(false);
          if (result) {
            setData(result);
          } else
            setError({
              title: t("GET_APP_ERROR_RESULT"),
              message: t("GET_APP_ERROR_RESULT_MSG")
            });
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          toggleSpinner(false);
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call();
  }
  // methods
  const imgs = ["jpg", "jpeg", "gif", "bmp", "png"];
  const videos = ["mp4", "3gp", "ogg", "wmv", "flv", "avi"];
  const audios = ["wav", "mp3", "ogg"];
  function getAssetUi(url) {
    const ext =
      url && url.length > 0
        ? url
            .split("/")
            .pop()
            .split(".")
            .pop()
        : "";
    if (imgs.indexOf(ext.toLowerCase()) !== -1)
      return <Image className="p-image-value" url={url} />;
    else if (videos.indexOf(ext.toLowerCase()) !== -1)
      return (
        <div className="p-thumbnail-file">
          <i className="icon-video" />
        </div>
      );
    else if (audios.indexOf(ext.toLowerCase()) !== -1)
      return (
        <div className="p-thumbnail-file">
          <i className="icon-audio" />
        </div>
      );
    else
      return (
        <div className="p-thumbnail-file unknown">
          <i className="icon-file-text" />
          .file
        </div>
      );
  }

  function handleItemViewClicked(row) {
    props.history.push(`/request/view/${row._id}`);
  }
  function handleItemOpenClicked(row) {
    props.history.push(`/offer/new/${row._id}`);
  }
  //#endregion controller

  return (
    <>
      <div className="p-wrapper">
        <div className="p-header">
          <div className="p-header-left">
            <span className="p-header-title">{t(pageTitle)}</span>
            <span className="p-header-description">{t(pageDescription)}</span>
          </div>
          <div className="p-header-right">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={t("NEW_APPS_SEARCH_PLACEHOLDER")}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="p-content">
          {spinner ? (
            <div className="page-loading">
              <SquareSpinner />
              <h4>{t("NEW_APPS_LOADING_TEXT")}</h4>
            </div>
          ) : error ? (
            <div className="page-list-error animated fadeIn">
              <Wrong />
              <h2>{error.title}</h2>
              <span>{error.message}</span>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="page-empty-list animated fadeIn">
              <Empty />
              <h2>{t("NEW_APPS_EMPTY_LIST_TITLE")}</h2>
              <span>{t("NEW_APPS_EMPTY_LIST_MSG")}</span>
            </div>
          ) : (
            <div className="forms">
              {data.map(r => (
                <Item
                  data={r}
                  onViewClicked={handleItemViewClicked}
                  onOpenClicked={handleItemOpenClicked}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {alertData && <Alert data={alertData} />}
    </>
  );
};

export default NewApplications;
