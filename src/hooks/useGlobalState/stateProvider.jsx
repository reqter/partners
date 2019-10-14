import React, { useEffect } from "react";
import { StateProvider } from "./index";
const Provider = props => {
  const token = false;
  const initialState = {
    spaceId: props.spaceId,
    isAuthenticated:
      token !== undefined && token !== null && token.length > 0 ? true : false,
    spaceInfo: undefined,
    userInfo: undefined,
    notifies: []
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGOUT":
        const logout = {
          ...state,
          isAuthenticated: false,
          spaceInfo: undefined,
          userInfo: undefined
        };
        return logout;
      case "SET_AUTHENTICATED":
        const auth = {
          ...state,
          isAuthenticated: action.value
        };
        return auth;
      case "SET_USERINFO":
        const u = {
          ...state,
          userInfo: action.value
        };
        return u;
      case "SET_SPACEINFO":
        const s_info = {
          ...state,
          spaceInfo: action.value
        };
        return s_info;
      case "ADD_NOTIFY":
        let newItem = { ...action.value };
        newItem.id = Math.random();
        let items_n = [...state.notifies];
        items_n.unshift(newItem);
        return {
          ...state,
          notifies: items_n
        };
      case "REMOVE_NOTIFY":
        const items = state.notifies.filter(
          item => item.id !== action.value.id
        );
        return {
          ...state,
          notifies: items
        };
      default:
        return state;
    }
  };
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {props.children}
      {/* <NotificationBar {...notifiIfo} /> */}
    </StateProvider>
  );
};
export default Provider;
