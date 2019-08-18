import React, { useState } from "react";
import useLayout from "./../useLayout";
import en from "./locales/en";
import fa from "./locales/fa";
//
const LocaleContext = React.createContext([{}, () => {}]);
//
const langs = {
  fa: {
    appLocale: fa,
    currentLang: "fa",
    direction: "rtl"
  },
  en: {
    appLocale: en,
    currentLang: "en",
    direction: "ltr"
  }
};

const LocaleProvider = props => {
  const l = langs[props.lang];
  useLayout(l ? l.direction : langs["fa"].direction);

  const [state, setState] = useState(() => {
    return l ? l : langs["fa"];
  });
  return (
    <LocaleContext.Provider value={[state, setState]}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext, LocaleProvider };
