import React from "react";
import "./styles.scss";
import LinkItem from "./linkItem";
import { useLocale } from "hooks";

const NavLinks = props => {
  const { appLocale, t, currentLang } = useLocale();
  function translate(key) {
    return t(key);
  }
  const links = [
    {
      name: translate("HOME_SIDE_NAV_FIRST"),
      icon: "item-type",
      path: `/newApplications`,
      desc: translate("HOME_SIDE_NAV_FIRST_DESC")
    },
    {
      name: translate("HOME_SIDE_NAV_SECOND"),
      icon: "request",
      path: `/forms`,
      desc: translate("HOME_SIDE_NAV_SECOND_DESC")
    },
    {
      name: translate("HOME_SIDE_NAV_THIRD"),
      icon: "product",
      path: `/requests`,
      desc: translate("HOME_SIDE_NAV_THIRD_DESC")
    },
    {
      name: translate("HOME_SIDE_NAV_FOURTH"),
      icon: "product",
      path: `/quotes`,
      desc: translate("HOME_SIDE_NAV_FOURTH_DESC")
    },
    {
      name: translate("HOME_SIDE_NAV_FIFTH"),
      icon: "partner",
      path: `/companies`,
      desc: translate("HOME_SIDE_NAV_FIFTH_DESC")
    },
    {
      name: translate("HOME_SIDE_NAV_SIXTH"),
      icon: "customer",
      path: `/customers`,
      desc: translate("HOME_SIDE_NAV_SIXTH_DESC")
    }
  ];

  return (
    <div className="sideLinks">
      {links.map(link => (
        <LinkItem link={link} key={link.path} />
      ))}
    </div>
  );
};

export default NavLinks;
