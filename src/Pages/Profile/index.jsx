import React, { useState, useEffect, useRef } from "react";

import "./styles.scss";
import { useGlobalState, useLocale } from "./../../hooks";
import { AssetBrowser, CircleSpinner, Alert, Image } from "../../components";
import { uploadAssetFile, addAsset } from "./../../Api/asset-api";
import {
  updateProfile,
  changeAvatar,
  changeNotification,
  sendEmailConfirmation,
  deleteAccount,
} from "./../../Api/account-api";

import UpdatePassword from "./modals/updatePassword";

const Profile = props => {
  const { appLocale, t, currentLang } = useLocale();
  const [{ userInfo, spaceInfo }, dispatch] = useGlobalState();
  const dropRef = useRef(null);
  
  const pageTitle = t("HOME_SIDE_NAV_PROFILE");
  const pageDescription = t("HOME_SIDE_NAV_PROFILE_DESC");

  const [dragging, setDragging] = useState(false);
  const [alertData, setAlertData] = useState();
  const [assetBrowser, toggleAssetBrowser] = useState(false);

  const [updatePasswordModal, toggleUpdatePassModal] = useState(false);
  const [updateSpinner, toggleUpdateSpinner] = useState(false);
  const [confirmEmailSpinner, toggleConfirmEmailSpinner] = useState(false);
  const [deleteAccountSpinner, toggleDeleteAccountSpinner] = useState(false);

  const [currentBox, setCurrentBox] = useState(1);
  const [isUploading, toggleIsUploading] = useState(false);
  const [notification, toggleNotification] = useState(
    userInfo ? userInfo.profile.notification : true
  );
  const [firstName, setFirstName] = useState(
    userInfo ? userInfo.profile.first_name : undefined
  );
  const [lastName, setLastName] = useState(
    userInfo ? userInfo.profile.last_name : undefined
  );
  const [avatar, setAvatar] = useState(
    userInfo
      ? userInfo.profile.avatar
      : "http://arunoommen.com/wp-content/uploads/2017/01/man-2_icon-icons.com_55041.png"
  );

  useEffect(() => {
    if (userInfo) {
      if (dropRef.current) {
        let div = dropRef.current;

        div.addEventListener("dragenter", handleDragIn);
        div.addEventListener("dragleave", handleDragOut);
        div.addEventListener("dragover", handleDrag);
        div.addEventListener("drop", handleDrop);
      }
      const { first_name, last_name, avatar, notification } = userInfo.profile;
      toggleNotification(notification !== undefined ? notification : true);
      setFirstName(first_name ? first_name : "");
      setLastName(last_name ? last_name : "");
      setAvatar(
        avatar
          ? avatar
          : "http://arunoommen.com/wp-content/uploads/2017/01/man-2_icon-icons.com_55041.png"
      );
    }

    return () => {
      if (dropRef.current) {
        let div = dropRef.current;
        div.removeEventListener("dragenter", handleDragIn);
        div.removeEventListener("dragleave", handleDragOut);
        div.removeEventListener("dragover", handleDrag);
        div.removeEventListener("drop", handleDrop);
      }
    };
  }, [userInfo]);

  function showBoxContent(num) {
    if (num !== currentBox) setCurrentBox(num);
  }
  function handleFirstName(e) {
    setFirstName(e.target.value);
  }
  function handleLastName(e) {
    setLastName(e.target.value);
  }

  function handleImageBrowsed(event) {
    if (!isUploading) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file.type.includes("image")) uploadAvatar(file);
      }
    }
  }
  function showUpdatePassModal() {
    toggleUpdatePassModal(true);
  }
  function handleCloseUpdatePass(result) {
    toggleUpdatePassModal(false);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0)
      setDragging(true);
  }

  function handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("image")) {
        handleDroppedImage(file);
      }
      e.dataTransfer.clearData();
    }
  }
  function showAssetBrowser() {
    toggleAssetBrowser(true);
  }
  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) {
      uploadAvatar(asset["url"][currentLang]);
    }
  }
  function updateProfileInfo() {
    if (!updateSpinner) {
      toggleUpdateSpinner(true);
      updateProfile()
        .onOk(result => {
          toggleUpdateSpinner(false);
          let u = { ...userInfo };
          u.profile["first_name"] = firstName;
          u.profile["last_name"] = lastName;
          dispatch({
            type: "SET_USERINFO",
            value: u,
          });
        })
        .onServerError(result => {
          toggleUpdateSpinner(false);
        })
        .onBadRequest(result => {
          toggleUpdateSpinner(false);
        })
        .unAuthorized(result => {
          toggleUpdateSpinner(false);
        })
        .notFound(result => {
          toggleUpdateSpinner(false);
        })
        .call(firstName, lastName);
    }
  }
  function handleDroppedImage(file) {
    if (!isUploading) {
      toggleIsUploading(true);

      uploadAssetFile()
        .onOk(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: t(
                "Image uploaded successfully.now it is changing avatar"
              ),
            },
          });
          const { file } = result;
          const obj = {
            name: file.originalname,
            title: file.originalname,
            description: "",
            url: {
              [currentLang]: file.url,
            },
            fileType: file.mimetype,
          };
          addAsset()
            .onOk(result => {
              changeAvatar()
                .onOk(result => {
                  toggleIsUploading(false);
                  let u = { ...userInfo };
                  u.profile["avatar"] = result.profile.avatar;
                  dispatch({
                    type: "SET_USERINFO",
                    value: u,
                  });
                })
                .onServerError(result => {
                  toggleIsUploading(false);
                })
                .onBadRequest(result => {
                  toggleIsUploading(false);
                })
                .unAuthorized(result => {
                  toggleIsUploading(false);
                })
                .notFound(result => {
                  toggleIsUploading(false);
                })
                .call(result.url[currentLang]);
            })
            .onServerError(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: t("UPSERT_ASSET_ADD_ON_SERVER_ERROR"),
                },
              });
            })
            .onBadRequest(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: t("UPSERT_ASSET_ADD_ON_BAD_REQUEST"),
                },
              });
            })
            .unAuthorized(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "warning",
                  message: t("UPSERT_ASSET_ADD_UN_AUTHORIZED"),
                },
              });
            })
            .notFound(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: t("UPSERT_ASSET_ADD_NOT_FOUND"),
                },
              });
            })
            .call(spaceInfo.id, obj);
        })
        .onServerError(result => {
          toggleIsUploading(false);
        })
        .onBadRequest(result => {
          toggleIsUploading(false);
        })
        .unAuthorized(result => {
          toggleIsUploading(false);
        })
        .onProgress(result => {
          //setPercentage(result);
        })
        .call(file);
    }
  }
  function uploadAvatar(url) {
    if (!isUploading) {
      toggleIsUploading(true);
      changeAvatar()
        .onOk(result => {
          toggleIsUploading(false);
          let u = { ...userInfo };
          u.profile["avatar"] = url;
          dispatch({
            type: "SET_USERINFO",
            value: u,
          });
        })
        .onServerError(result => {
          toggleIsUploading(false);
        })
        .onBadRequest(result => {
          toggleIsUploading(false);
        })
        .unAuthorized(result => {
          toggleIsUploading(false);
        })
        .notFound(result => {
          toggleIsUploading(false);
        })
        .call(url);
    }
  }
  function confirmEmail() {
    if (!confirmEmailSpinner) {
      toggleConfirmEmailSpinner(true);
      sendEmailConfirmation()
        .onOk(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: t("PROFILE_EMAIL_CONFRIMATION_ON_OK"),
            },
          });
          toggleConfirmEmailSpinner(false);
        })
        .onServerError(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("PROFILE_EMAIL_CONFRIMATION_ON_SERVER_ERROR"),
            },
          });
          toggleConfirmEmailSpinner(false);
        })
        .onBadRequest(result => {
          toggleConfirmEmailSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("PROFILE_EMAIL_CONFRIMATION_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized(result => {
          toggleConfirmEmailSpinner(false);
        })
        .notFound(result => {
          toggleConfirmEmailSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("PROFILE_EMAIL_CONFRIMATION_NOT_FOUND"),
            },
          });
        })
        .call();
    }
  }
  function handleNotification(e) {
    toggleNotification(e.target.checked);
    const value = e.target.checked;
    changeNotification()
      .onOk(result => {
        // let u = { ...userInfo };
        // u.profile["notification"] = value;
        dispatch({
          type: "SET_USERINFO",
          value: result,
        });
      })
      .onServerError(result => {
        toggleNotification(!value);
      })
      .onBadRequest(result => {
        toggleNotification(!value);
      })
      .unAuthorized(result => {
        toggleNotification(!value);
      })
      .notFound(result => {
        toggleNotification(!value);
      })
      .call(e.target.checked);
  }
  function showNotify(type, msg) {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: type,
        message: msg,
      },
    });
  }
  function handleDeleteAccount() {
    setAlertData({
      type: "error",
      title: "Delete Account",
      message: "Are you sure to remove?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () =>
        deleteAccount()
          .onOk(result => {
            setAlertData();
            showNotify("success", "Your account deleted successfully");
            dispatch({
              type: "LOGOUT",
              value: false,
            });
            props.history.replace("login");
          })
          .onServerError(result => {
            showNotify("success", "Internal server error");
            setAlertData();
          })
          .onBadRequest(result => {
            setAlertData();
          })
          .unAuthorized(result => {
            setAlertData();
          })
          .notFound(result => {
            setAlertData();
          })
          .call(),
      onCancel: () => {
        setAlertData();
      },
    });
  }
  return (
    <>
      <div className="pro-wrapper">
        <div className="pro-header">
          <div className="pro-header-left">
            <span className="pro-header-title">{t(pageTitle)}</span>
            <span className="pro-header-description">{t(pageDescription)}</span>
          </div>
          <div className="pro-header-right" />
        </div>
        <div className="pro-content">
          <div className="pro-box">
            <div
              className={
                "pro-box-header " + (currentBox !== 1 ? "hoverBox" : "")
              }
              onClick={() => showBoxContent(1)}
            >
              {t("PROFILE_FIRST_BOX_TITLE")}
            </div>
            {currentBox === 1 && (
              <div className="pro-box-content animated fadeIn">
                <label>{t("PROFILE_AVATAR_TITLE")}</label>
                <div className="pro-box-content-upload">
                  <div className="uploadAvatar">
                    {isUploading && (
                      <div className="uploadingSpinner">
                        <CircleSpinner show={true} size="medium" />
                      </div>
                    )}
                    <div className="avatarImage">
                      <Image url={avatar} alt="" />
                    </div>
                  </div>
                  <div
                    className="uploadDropZone"
                    ref={dropRef}
                    style={{
                      border: dragging
                        ? "3px dashed lightgray"
                        : "0.5px solid lightgray",
                    }}
                  >
                    <div className="dropText">
                      {t("PROFILE_DROP_FILE_TEXT")}
                      <span onClick={showAssetBrowser}>
                        <a>{t("PROFILE_DROP_FILE_LINK")}</a>
                        {/* <input type="file" onChange={handleImageBrowsed} /> */}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="uploadInfo">{t("PROFILE_DROP_FILE_DESC")}</div>
                <div className="form-group">
                  <label>{t("PROFILE_FIRST_NAME_INPUT_TITLE")}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("PROFILE_FIRST_NAME_INPUT_PLACEHOLDER")}
                    value={firstName}
                    onChange={handleFirstName}
                  />
                  <small className="form-text text-muted">
                    {t("PROFILE_FIRST_NAME_INPUT_INFO")}
                  </small>
                </div>
                <div className="form-group">
                  <label>{t("PROFILE_LAST_NAME_INPUT_TITLE")}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("PROFILE_LAST_NAME_INPUT_PLACEHOLDER")}
                    value={lastName}
                    onChange={handleLastName}
                  />
                  <small className="form-text text-muted">
                    {t("PROFILE_LAST_NAME_INPUT_INFO")}
                  </small>
                </div>
                <div className="firstTabActions">
                  <button
                    className="btn btn-primary ajax-button"
                    onClick={updateProfileInfo}
                  >
                    <CircleSpinner show={updateSpinner} size="small" />
                    <span>{t("UPDATE")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="pro-box">
            <div
              className={
                "pro-box-header " + (currentBox !== 2 ? "hoverBox" : "")
              }
              onClick={() => showBoxContent(2)}
            >
              {t("PROFILE_SECOND_TAB_TITLE")}
            </div>
            {currentBox === 2 && (
              <>
                <div className="pro-box-content">
                  <div className="text-switch">
                    <div className="left-text">
                      <span className="left-text-title">
                        {t("PROFILE_EMAIL_VERIFY")}
                      </span>
                      <span className="left-text-description">
                        {t("PROFILE_EMAIL_VERIFY_INFO")}
                      </span>
                    </div>
                    <div className="right-switch">
                      {userInfo && userInfo.emailConfirmed === true && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                        >
                          <span className="icon-checkmark" />
                          &nbsp; {t("PROFILE_PROFILE_EMAIL_VERIFY_BTN")}
                        </button>
                      )}
                      {userInfo &&
                        (userInfo.emailConfirmed === undefined ||
                          userInfo.emailConfirmed === false) && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm ajax-button"
                            onClick={confirmEmail}
                          >
                            <CircleSpinner
                              show={confirmEmailSpinner}
                              size="small"
                            />
                            {!confirmEmailSpinner &&
                              t("PROFILE_SEND_CONFIRMATION")}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
                <div className="pro-box-content">
                  <div className="text-switch">
                    <div className="left-text">
                      <span className="left-text-title">
                        {t("PROFILE_PASSWORD")}
                      </span>
                      <span className="left-text-description">
                        {t("PROFILE_PASSWORD_INFO")}
                      </span>
                    </div>
                    <div className="right-switch">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={showUpdatePassModal}
                      >
                        {t("PROFILE_PASSWORD_BTN")}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="pro-box">
            <div
              className={
                "pro-box-header " + (currentBox !== 3 ? "hoverBox" : "")
              }
              onClick={() => showBoxContent(3)}
            >
              {t("PROFILE_THIRD_BOX_TITLE")}
            </div>
            {currentBox === 3 && (
              <div className="pro-box-content">
                <label for="notify" className="text-switch">
                  <div className="left-text">
                    <span className="left-text-title">
                      {t("PROFILE_EMAIL_NOTIF")}
                    </span>
                    <span className="left-text-description">
                      {t("PROFILE_EMAIL_NOTIF_INFO")}
                    </span>
                  </div>
                  <div className="right-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        className="primary"
                        onChange={handleNotification}
                        checked={notification}
                        id="notify"
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </label>
              </div>
            )}
          </div>
          <div className="pro-box">
            <div
              className={
                "pro-box-header " + (currentBox !== 4 ? "hoverBox" : "")
              }
              onClick={() => showBoxContent(4)}
            >
              {t("PROFILE_FOURTH_BOX_TITLE")}
            </div>
            {currentBox === 4 && (
              <div className="pro-box-content">
                <div className="text-switch">
                  <div className="left-text">
                    <span className="left-text-title">
                      {t("PROFILE_DELETE_ACCOUNT")}
                    </span>
                    <span className="left-text-description">
                      {t("PROFILE_DELETE_ACCOUNT_INFO")}
                    </span>
                  </div>
                  <div className="right-switch">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={handleDeleteAccount}
                    >
                      <CircleSpinner show={deleteAccountSpinner} />
                      {!deleteAccountSpinner && t("PROFILE_DELETE_ACCOUNT_BTN")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {updatePasswordModal && (
        <UpdatePassword
          isOpen={updatePasswordModal}
          onClose={handleCloseUpdatePass}
        />
      )}
      {alertData && <Alert data={alertData} />}
      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={["image"]}
        />
      )}
    </>
  );
};

export default Profile;
