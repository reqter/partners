import React, { useState } from "react";
import { withRouter } from "react-router";
import "./styles.scss";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";

import { useGlobalState, useLocale, useCookie } from "../../../../../../hooks";
import { Image } from "../../../../../../components";
const ProfileWidget = props => {
  const [token, setToken] = useCookie("reqter_token");
  const { match, location, history } = props;
  const { appLocale, t, currentLang } = useLocale();
  const [{ userInfo, isAuthenticated }, dispatch] = useGlobalState();

  const [dropDownVisibility, toggleVisibility] = useState(false);
  function toggle() {
    toggleVisibility(prevState => !prevState);
  }
  function logout() {
    setToken(undefined);
    dispatch({
      type: "LOGOUT",
      value: false,
    });
    history.replace(`/${currentLang}/login`);
  }
  function showProfile() {
    history.push(`/${currentLang}/profile`);
  }

  return (
    <div className="profile-widget">
      {userInfo && userInfo.profile && userInfo.profile.avatar ? (
        <div className="userImage">
          <Image url={userInfo.profile.avatar} alt="" />
        </div>
      ) : (
        <div className="left">
          <i className="icon-user" />
        </div>
      )}

      <div className="centerbox">
        {userInfo && (
          <>
            <span className="title">
              {(!userInfo.profile.first_name ||
                userInfo.profile.first_name.length === 0) &&
              (!userInfo.profile.last_name || userInfo.profile.last_name.length)
                ? "Your Name"
                : userInfo.profile.first_name +
                  " " +
                  userInfo.profile.last_name}
            </span>
            <span className="role">{userInfo.username}</span>
          </>
        )}
      </div>
      <div className="right">
        <Dropdown isOpen={dropDownVisibility} toggle={toggle}>
          <DropdownToggle className="btn btn-light btn-small">
            <i className="icon-more-h" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={showProfile}>
              {t("HOME_SIDEBAR_PROFILE_PROFILE")}
            </DropdownItem>
            <DropdownItem onClick={logout}>
              {t("HOME_SIDEBAR_PROFILE_LOGOUT")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
export default withRouter(ProfileWidget);
