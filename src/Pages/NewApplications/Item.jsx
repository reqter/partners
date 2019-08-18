import React, { useState, useCallback, useEffect } from "react";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownItem from "reactstrap/lib/DropdownItem";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
//
import { useLocale } from "../../hooks";
import { DateFormatter } from "../../components";
//
export default function FormItem(props) {
  const dataLanguage = "fa";
  const { currentLang, t } = useLocale();
  const { data } = props;
  const [dropDown, toggleDropDown] = useState(false);

  function handleDropDownVisibility() {
    toggleDropDown(prevState => !prevState);
  }

  const handleViewClicked = useCallback(() => {
    if (props.onViewClicked) {
      props.onViewClicked(data);
    }
  }, []);
  const handleOpenClicked = useCallback(() => {
    if (props.onOpenClicked) {
      props.onOpenClicked(data);
    }
  }, []);

  return (
    <div className="formItem">
      <div className="formItem__top">
        {data.contentType ? (
          data.contentType.media && data.contentType.media.length > 0 ? (
            <img src={data.contentType.media[0][dataLanguage]} alt="" />
          ) : (
            <div className="formItem__top__emptyC_Img">بدون تصویر</div>
          )
        ) : (
          <div className="formItem__top__emptyC_Img">بدون تصویر</div>
        )}
      </div>
      <div className="formItem__bottom">
        <h6>
          {data.fields
            ? data.fields.name
              ? data.fields.name[dataLanguage]
                ? data.fields.name[dataLanguage]
                : data.fields.name
              : ""
            : ""}
        </h6>
        <div className="actions_date">
          <i className="icon-calendar" />
          <span>
            <DateFormatter date={data.sys.issueDate} />
          </span>
          <button className="btn btn-light btn-sm" onClick={handleViewClicked}>
            {t("NEW_APPS_ITEM_VIEW")}
          </button>
          <button className="btn btn-light btn-sm" onClick={handleOpenClicked}>
            {t("NEW_APPS_ITEM_CHOOSE")}
          </button>
        </div>
      </div>
    </div>
  );
}
