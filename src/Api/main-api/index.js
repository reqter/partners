import axios from "axios";
const config = process.env;
const baseUrl = config.REACT_APP_REQUESTS_BASE_URL;
const getAllURL =
  config.REACT_APP_CONTENTS_BASE_URL + config.REACT_APP_CONTENTS_GET_ALL;

export function getNewRequests() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = () => {
    const url = getAllURL;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        } else _unKnownError();
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
