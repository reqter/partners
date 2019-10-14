import React from "react";
import axios from "axios";
import { useGlobalState, useLocale } from "hooks";
//
const config = process.env;
const baseUrl = config.REACT_APP_BASE_URL;

function AxiosInitializer({ children, spaceId }) {
  const { t } = useLocale();
  const [{}, dispatch] = useGlobalState();

  React.useEffect(() => {
    axios.interceptors.request.use(
      function(config) {
        config.headers.common["spaceId"] = spaceId;
        // Do something before request is sent
        return config;
      },
      function(error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        const response = error.response;
        if (response.status === 401) {
          const url = response.config.url;

          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UN_AUTHORIZED")
            }
          });
          dispatch({
            type: "SET_AUTHENTICATION",
            payload: false
          });
        }

        return Promise.reject(error);
      }
    );
  }, [dispatch]);

  return children;
}

export default AxiosInitializer;
