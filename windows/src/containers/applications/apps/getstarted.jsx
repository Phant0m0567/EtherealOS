import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import countries from "./assets/countrylist.json";
import "./assets/getstarted.scss";
import LangSwitch from "./assets/Langswitch";
import { useTranslation } from "react-i18next";

const GetstartedContent = ({ standalone = false, onComplete }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskbar);
  const { t } = useTranslation();

  const getAutoCountry = () => {
    const localeSource =
      (typeof navigator !== "undefined" &&
        (navigator.language || navigator.languages?.[0])) ||
      "en-US";
    const regionCode = new Intl.Locale(localeSource).region;

    if (regionCode) {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      const displayName = displayNames.of(regionCode);
      if (displayName) {
        const match = countries.find(
          (country) =>
            country.toLowerCase() === displayName.toLowerCase() ||
            country.toLowerCase().includes(displayName.toLowerCase()) ||
            displayName.toLowerCase().includes(country.toLowerCase()),
        );
        if (match) return match;
      }
    }

    return countries.find((country) => country === "United States") || countries[0];
  };

  const userName = useSelector((state) => state.setting.person.name || "");
  const invalidDeviceNameChars = /[\s/\\\[\]:|<>+=;,+?]/;
  const isValidDeviceName = (value) => {
    const nextName = String(value || "").trim();
    return nextName.length > 0 && nextName.length <= 15 && !invalidDeviceNameChars.test(nextName);
  };
  const [pageNo, setPageNo] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(() => getAutoCountry());
  const autoCountry = getAutoCountry();
  const orderedCountries = [
    selectedCountry,
    ...countries.filter((country) => country !== selectedCountry),
  ];
  const selectedCountryRef = useRef(null);

  useEffect(() => {
    if (pageNo === 1 && selectedCountryRef.current) {
      selectedCountryRef.current.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    }
  }, [pageNo, selectedCountry]);
  const nextPage = () => {
    if (pageNo === 4 && !isValidDeviceName(userName)) {
      return;
    }
    if (pageNo === 6) {
      localStorage.setItem("setupComplete", "true");
      window.dispatchEvent(new Event("setup-complete"));
      if (onComplete) onComplete();
      return;
    }
    setPageNo(pageNo + 1);
  };

  const changUserName = (e) => {
    var newName = String(e.target.value || "")
      .replace(invalidDeviceNameChars, "")
      .slice(0, 15);
    dispatch({
      type: "STNGSETV",
      payload: {
        path: "person.name",
        value: newName,
      },
    });
  };

  return (
    <div
      className={standalone ? "getstarted getstartedsetup" : "getstarted floatTab dpShad"}
      data-size={standalone ? undefined : "full"}
      data-max={standalone ? undefined : null}
      style={
        standalone
          ? undefined
          : { zIndex: 1 }
      }
      data-hide={standalone ? undefined : false}
    >
      {!standalone ? (
        <ToolBar app="OOBE" icon="getstarted" size="full" name="Get Started" />
      ) : null}
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="inner_fill_setup">
            {pageNo === 1 ? (
              <>
                <div className="left">
                  <img
                    alt="left image"
                    id="left_img"
                    src="img/oobe/window11_oobe_region.png"
                  />
                </div>
                <div className="right">
                  <div className="header">
                    {t("oobe.country")}
                    <br />
                    <div className="header_sml"></div>
                  </div>
                  <div className="list_oobe mt-4 win11Scroll">
                    {orderedCountries.map((e, i) => {
                      const isSelected = e === selectedCountry;
                      return (
                        <div
                          key={i}
                          ref={isSelected ? selectedCountryRef : null}
                          className={isSelected ? "list_oobe_opt selected" : "list_oobe_opt"}
                          onClick={() => setSelectedCountry(e)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedCountry(e);
                            }
                          }}
                        >
                          {e}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 2 ? (
              <>
                <div className="left">
                  <img
                    id="left_img"
                    src="img/oobe/window11_oobe_keyb_layout.png"
                  />
                </div>
                <div className="right">
                  <div className="header">
                    {t("oobe.keyboard")}
                    <div className="header_sml">
                      {t("oobe.anotherkeyboard")}
                    </div>
                  </div>
                  <div className="list_oobe mt-4 win11Scroll">
                    <LangSwitch />
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 3 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_update.png" />
                </div>
                <div className="right align">
                  <img id="loader" src="img/oobe/window11_oobe_region.png" />
                  Checking for updates.
                </div>
              </>
            ) : null}
            {pageNo === 4 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_name.png" />
                </div>
                <div className="right">
                  <div className="header mb-2">Give your PC a name</div>
                  <div className="header_sml">
                    Pick a name that makes it easy to spot on your network.
                    You can change it later if you want.
                  </div>
                  <div className="OOBE_input">
                    <input
                      type="text"
                      placeholder="name"
                      id="OOBE_input"
                      value={userName}
                      maxLength={15}
                      onChange={changUserName}
                    />
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 5 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_wifi.png" />
                </div>
                <div className="right">
                  <div className="header">
                    Let's connect you to a network
                    <div className="header_sml">
                      You'll need an internet connection to continue the setting
                      up your device.Once connected, you'll get the latest
                      features and security updates.
                    </div>
                    <div className="ethernet_list">
                      <div className="list_oobe_opt_wifi">
                        <i id="connection" className="bx bx-desktop"></i>{" "}
                        <div className="ethernet_list_opt_inr">
                          <div className="text_sml_black_wifi">Ethernet 01</div>
                          <div className="header_sml_wifi">Not connected</div>
                        </div>
                      </div>
                      <div className="list_oobe_opt"></div>
                      <div className="list_oobe_opt"></div>
                    </div>
                    <div className="text_sml_black">
                      Having trouble to getting connected?
                    </div>
                    <div className="header_sml">
                      For troubleshooting tips use another device and visit
                      aka.ms/networksetup
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {pageNo === 6 ? (
              <>
                <div className="left">
                  <img id="left_img" src="img/oobe/window11_oobe_update.png" />
                </div>
                <div className="right">
                  <div className="header mb-8">You're all set.</div>
                  <div>Everything is ready to go.</div>
                </div>
              </>
            ) : null}

            <div
              className="yes_button base"
              onClick={pageNo === 4 && !isValidDeviceName(userName) ? undefined : nextPage}
              style={
                pageNo === 4 && !isValidDeviceName(userName)
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : undefined
              }
              aria-disabled={pageNo === 4 && !isValidDeviceName(userName)}
            >
              Next
            </div>
          </div>

          {!standalone ? (
            <div className="setup_settings">
              <img
                alt="accessibility"
                className="mr-4 acsblty"
                src="img/oobe/window11_oobe_accessibility.png"
                width={16}
              />
              <Icon
                className="taskIcon"
                src={`audio${tasks.audio}`}
                ui
                width={16}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const Getstarted = () => {
  const wnapp = useSelector((state) => state.apps.getstarted);

  return (
    <div
      className="getstarted floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{ ...(wnapp.size == "cstm" ? wnapp.dim : null), zIndex: wnapp.z }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Get Started"
      />
      <GetstartedContent />
    </div>
  );
};

export const GetstartedStandalone = ({ onComplete }) => (
  <GetstartedContent standalone onComplete={onComplete} />
);
