import React from "react";
import { useLocale } from "./../../../../hooks";
import "./styles.scss";
import ProfileWidget from "./components/profileWidget";
import SideLinks from "./components/SideLinks";

const SideBar = props => {
  const { t } = useLocale();
  return (
    <div className="sideBar">
      <div className="top">
        <i className="icon-logo icon" />
        <span className="title">{t("BRAND_NAME")}</span>
      </div>
      <ProfileWidget />
      <SideLinks links={props.links} />
    </div>
  );
};
export default SideBar;
