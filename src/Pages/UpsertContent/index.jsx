import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { addContent, getContentById } from "./../../Api/content-api";
import {
  String,
  Number,
  DateTime,
  Location,
  Media,
  Boolean,
  KeyValue,
  RichText,
  Reference,
  CircleSpinner,
  JsonObject,
  AdvanceUploaderView,
  SquareSpinner,
  PersianDateTime
} from "./../../components";
import { Wrong } from "./../../components/Commons/ErrorsComponent";

import { useGlobalState, useCookie, useLocale } from "./../../hooks";

const UpsertContent = props => {
  let didCancel = false;
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { currentLang, t, direction } = useLocale();
  // variables

  const [viewMode] = useState(props.match.url.includes("view") ? true : false);
  const [box, changeBox] = useState("form");
  const [item, setItem] = useState();

  const [formData, setFormData] = useState({});
  const [form, setForm] = useState({});
  const [formValidation, setFormValidation] = useState();
  const [error, setError] = useState();
  const [isValidForm, toggleIsValidForm] = useState(false);

  const [mainSpinner, toggleMainSpinner] = useState(true);
  const [spinner, toggleSpinner] = useState(false);
  const [closeSpinner, toggleCloseSpinner] = useState(false);

  useEffect(() => {
    if (props.match.params.id) {
      getItemById(props.match.params.id);
    } else {
      setError({
        title: "",
        message: ""
      });
    }
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(form).length > 0 && checkFormValidation()) {
      toggleIsValidForm(true);
    } else toggleIsValidForm(false);
  }, [formValidation]);

  // methods
  function checkFormValidation() {
    for (const key in formValidation) {
      if (formValidation[key] === false) return false;
    }
    return true;
  }

  function getItemById(id) {
    getContentById()
      .onOk(result => {
        toggleMainSpinner(false);
        if (result) {
          if (!result.contentType) {
            setError({
              title: "",
              message: ""
            });
          } else {
            initEditMode(result);
          }
        } else {
          setError({
            title: "",
            message: ""
          });
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call(spaceInfo.id, id);
  }
  function initEditMode(result) {
    setItem(result);
    setFormData(result.fields);
    setForm(result.fields);
  }
  function setNameToFormValidation(name, value) {
    if (!formValidation || formValidation[name] !== null) {
      setFormValidation(prevFormValidation => ({
        ...prevFormValidation,
        [name]: value
      }));
    }
  }
  function handleOnChangeValue(field, value, isValid) {
    const { name: key } = field;
    setForm(prevForm => {
      const obj = { ...prevForm, [key]: value };
      return obj;
    });
    setFormValidation(prevFormValidation => ({
      ...prevFormValidation,
      [key]: isValid
    }));
  }
  function getFieldItem(field) {
    switch (field.type.toLowerCase()) {
      case "string":
        return (
          <String
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "number":
        return (
          <Number
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "datetime":
        return (
          <PersianDateTime
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "location":
        return (
          <Location
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "media":
        if (viewMode) {
          return (
            <AdvanceUploaderView
              viewMode={viewMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
        } else
          return (
            <Media
              viewMode={viewMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
      case "boolean":
        return (
          <Boolean
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "keyvalue":
        return (
          <KeyValue
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "richtext":
        return (
          <RichText
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "reference":
        return (
          <Reference
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "jsonobject":
        return (
          <JsonObject
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      default:
        break;
    }
  }
  function exit() {
    props.history.push(`/${currentLang}/newApplications`);
  }

  function upsertItem(closePage) {
    if (!spinner && !closeSpinner) {
      if (closePage) toggleCloseSpinner(true);
      else toggleSpinner(true);
      upsertContent(closePage);
    }
  }

  function upsertContent(closePage) {
    const obj = {
      contentType: "",
      fields: form
    };
    addContent()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("UPSERT_ITEM_ADD_ON_OK")
          }
        });
        if (closePage) {
          exit();
        } else {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          setFormData({});
          setForm({});
          // let n_obj = {};
          // for (const key in formValidation) {
          //   n_obj[key] = false;
          // }
          setFormValidation({});
        }
      })
      .onServerError(result => {
        if (closePage) toggleCloseSpinner(false);
        else toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UPSERT_ITEM_ADD_ON_SERVER_ERROR")
          }
        });
      })
      .onBadRequest(result => {
        if (closePage) toggleCloseSpinner(false);
        else toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UPSERT_ITEM_ADD_ON_BAD_REQUEST")
          }
        });
      })
      .unAuthorized(result => {
        if (closePage) toggleCloseSpinner(false);
        else toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: t("UPSERT_ITEM_ADD_UN_AUTHORIZED")
          }
        });
      })
      .notFound(result => {
        if (closePage) toggleCloseSpinner(false);
        else toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: t("UPSERT_ITEM_ADD_NOT_FOUND")
          }
        });
      })
      .call(spaceInfo.id, obj);
  }
  return (
    <div className="up-wrapper">
      <div className="up-header">
        <button className="btn btn-light" onClick={exit}>
          <i
            className={
              "icon-arrow-" + (direction === "ltr" ? "left2" : "right2")
            }
          />
          {t("CANCEL")}
        </button>
        <div className="tabItems">
          <div className="item active">
            {viewMode
              ? t("FORM_HEADER_VIEW_TITLE")
              : t("FORM_HEADER_INSERT_TITLE")}
          </div>
        </div>
      </div>
      <div className="up-content">
        <main>
          {mainSpinner ? (
            <div className="page-loading">
              <SquareSpinner />
              <h4>{t("FORM_LOADING_TEXT")}</h4>
            </div>
          ) : error ? (
            <div className="page-list-error animated fadeIn">
              <Wrong />
              <h2>{error.title}</h2>
              <span>{error.message}</span>
            </div>
          ) : box === "form" ? (
            <>
              <div className="up-categoryBox animated fadeIn">
                {item &&
                item.contentType.media &&
                item.contentType.media.length > 0 ? (
                  <div className="selectedCategory-img">
                    <img src={item.contentType.media[0][currentLang]} alt="" />
                  </div>
                ) : (
                  <div className="selectedCategory-icon">
                    <div className="contentIcon">
                      <i className="icon-item-type" />
                    </div>
                  </div>
                )}
                <span>{item && item.contentType.title[currentLang]}</span>
              </div>
              <div className="up-formInputs animated fadeIn">
                {item &&
                  item.contentType &&
                  item.contentType.fields &&
                  item.contentType.fields.map(field => (
                    <div key={field.id} className="rowItem">
                      {getFieldItem(field)}
                    </div>
                  ))}
                {!viewMode && (
                  <div className="form-submit-btns">
                    <button
                      className="btn btn-primary"
                      onClick={() => upsertItem(false)}
                      disabled={!isValidForm}
                    >
                      <CircleSpinner show={spinner} size="small" />
                      {!spinner && t("SAVE_AND_NEW")}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => upsertItem(true)}
                      disabled={!isValidForm}
                    >
                      <CircleSpinner show={closeSpinner} size="small" />
                      {!closeSpinner && t("SAVE_AND_CLOSE")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            box === "success" && <div />
          )}
        </main>
      </div>
    </div>
  );
};

export default UpsertContent;
