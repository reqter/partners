import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { utility } from "../../services";
import { useLocale } from "./../../hooks";
import AssetBrowser from "./../AssetBrowser";
import Image from "./../Image";

const MediaInput = props => {
  const { appLocale, t, currentLang } = useLocale();
  const { field, formData } = props;
  const [assetBrowser, toggleAssetBrowser] = useState(false);
  const [files, setFiles] = useState([]);

  // set form value update time
  useEffect(() => {
    if (formData[field.name] && formData[field.name].length > 0) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);

      const d = formData[field.name].map(item => {
        return {
          id: Math.random(),
          url: item,
        };
      });
      setFiles(d);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      if (files.length > 0) setFiles([]);
    }
  }, [formData]);

  // useEffect(() => {
  //   // send value to form after updateing
  //   let result = files.map(item => item.url);
  //   if (result.length === 0) result = [];
  //   if (field.isRequired === true) {
  //     if (result === undefined || result.length === 0)
  //       if (props.onChangeValue) props.onChangeValue(field, result, false);
  //       else {
  //         if (props.onChangeValue) props.onChangeValue(field, result, true);
  //       }
  //   } else {
  //     if (props.onChangeValue) props.onChangeValue(field, result, true);
  //   }
  // }, [files]);
  function addToParentForm(fs) {
    let result = fs.map(item => item.url);
    if (result.length === 0) result = [];
    if (field.isRequired === true) {
      if (result === undefined || result.length === 0)
        if (props.onChangeValue) props.onChangeValue(field, result, false);
        else {
          if (props.onChangeValue) props.onChangeValue(field, result, true);
        }
    } else {
      if (props.onChangeValue) props.onChangeValue(field, result, true);
    }
  }

  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) {
      const obj = {
        id: Math.random(),
        url: field.isTranslate
          ? asset.url
          : {
              [currentLang]: asset.url[currentLang],
            },
      };
      if (field.isList !== undefined && field.isList) {
        const newFiles = [...files, obj];
        setFiles(newFiles);
        addToParentForm(newFiles);
      } else {
        let fs = [];
        fs[0] = obj;
        setFiles(fs);
        addToParentForm(fs);
      }
    }
  }

  function removeFile(f) {
    const fs = files.filter(file => file.id !== f.id);
    setFiles(fs);
  }
  function openAssetBrowser() {
    toggleAssetBrowser(true);
  }
  return (
    <>
      <div className="up-uploader">
        <span className="title">{field.title[currentLang]}</span>
        {field.description && (
          <span className="description">
            {field.description && field.description[currentLang]}
          </span>
        )}
        <div className="files">
          {props.viewMode && (!files || files.length === 0) ? (
            <div className="files-uploaded">
              <div className="updatedFileType" style={{ fontSize: 17 }}>
                empty
              </div>
            </div>
          ) : (
            files.map(file => (
              <div key={file.id} className="files-uploaded">
                {!props.viewMode && (
                  <div
                    className="files-uploaded-icon"
                    onClick={() => removeFile(file)}
                  >
                    <i className="icon-bin" />
                  </div>
                )}
                <div className="updatedFileType">
                  {field.mediaType === "image" ? (
                    <Image url={file.url[currentLang]} />
                  ) : field.mediaType === "video" ? (
                    <i className="icon-video" />
                  ) : field.mediaType === "audio" ? (
                    <i className="icon-audio" />
                  ) : field.mediaType === "pdf" ? (
                    <i className="icon-pdf" />
                  ) : field.mediaType === "spreadsheet" ? (
                    <i className="icon-spreadsheet" />
                  ) : (
                    utility.getAssetIconByURL(file.url[currentLang])
                  )}
                </div>
              </div>
            ))
          )}
          {}
          {!props.viewMode && (
            <div className="files-input" onClick={openAssetBrowser}>
              {field.mediaType === "file" ? (
                <i className="icon-file-plus-o" />
              ) : field.mediaType === "image" ? (
                <i className="icon-camera" />
              ) : (
                <i className="icon-file-plus-o" />
              )}
            </div>
          )}
        </div>
      </div>

      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={field.mediaType ? [field.mediaType] : undefined}
        />
      )}
    </>
  );
};

export default MediaInput;
