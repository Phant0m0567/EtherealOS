import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar, LazyComponent } from "../../../utils/general";
import "./assets/chrome.scss";

export const ChromeMenu = () => {
  const wnapp = useSelector((state) => state.apps.chrome);
  const dispatch = useDispatch();

  const appState = wnapp || {
    size: "full",
    hide: true,
    max: null,
    z: 0,
    action: "CHROME",
    icon: "chrome",
  };

  const getDomain = (targetUrl) => {
    if (!targetUrl) return "";
    try {
      return new URL(targetUrl).hostname;
    } catch {
      return targetUrl.replace(/^https?:\/\//, "").split("/")[0];
    }
  };

  const isValidURL = (string) => {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    );
    return res !== null;
  };

  const getSiteTitle = (targetUrl) => {
    if (!targetUrl || targetUrl === "chrome://newtab") return "New Tab";
    try {
      const parsed = new URL(targetUrl);
      const host = parsed.hostname.replace(/^www\./, "");
      return host.charAt(0).toUpperCase() + host.slice(1);
    } catch {
      return targetUrl;
    }
  };

  const createTabObject = (initialUrl = "") => ({
    id: `tab-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    title: getSiteTitle(initialUrl),
    url: initialUrl,
    history: [initialUrl],
    histIndex: 0,
    ierror: false,
  });

  const [tabs, setTabs] = useState([
    {
      id: "tab-initial",
      title: "New Tab",
      url: "",
      history: [""],
      histIndex: 0,
      ierror: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-initial");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOmniboxFocused, setIsOmniboxFocused] = useState(false);
  const [ntpSearchQuery, setNtpSearchQuery] = useState("");
  const iframeRefs = useRef({});

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || {
    id: "tab-initial",
    title: "New Tab",
    url: "",
    history: [""],
    histIndex: 0,
    ierror: false,
  };

  const isNTP = !activeTab.url || activeTab.url === "" || activeTab.url === "chrome://newtab";

  useEffect(() => {
    if (!isTyping) {
      setInputValue(activeTab.url || "");
    }
  }, [activeTab.id, activeTab.url, isTyping]);

  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem("chrome_shortcuts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { name: "Google", url: "https://www.google.com/webhp?igu=1" },
      { name: "YouTube", url: "https://www.youtube.com/" },
      { name: "Gmail", url: "https://mail.google.com/" },
      { name: "GitHub", url: "https://github.com/" },
      { name: "Wikipedia", url: "https://www.wikipedia.org/" },
      { name: "Reddit", url: "https://www.reddit.com/" },
      { name: "Twitter", url: "https://twitter.com/" },
      { name: "ChatGPT", url: "https://chatgpt.com/" },
    ];
  });

  const defaultBookmarks = [
    { name: "Google", url: "https://www.google.com/webhp?igu=1" },
    { name: "YouTube", url: "https://www.youtube.com/" },
    { name: "Gmail", url: "https://mail.google.com/" },
    { name: "GitHub", url: "https://github.com/" },
    { name: "Wikipedia", url: "https://www.wikipedia.org/" },
  ];

  const navigateTo = (targetUrl, targetTabId = activeTabId) => {
    setIsTyping(false);
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== targetTabId) return t;
        const newHist = t.history.slice(0, t.histIndex + 1);
        newHist.push(targetUrl);
        return {
          ...t,
          url: targetUrl,
          title: getSiteTitle(targetUrl),
          history: newHist,
          histIndex: newHist.length - 1,
          ierror: false,
        };
      })
    );
    if (targetTabId === activeTabId) {
      setInputValue(targetUrl);
    }
  };

  const openNewTab = (initialUrl = "") => {
    const newTab = createTabObject(initialUrl);
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
    setInputValue(initialUrl);
    setIsTyping(false);
    setNtpSearchQuery("");
  };

  const closeTab = (targetTabId, e) => {
    if (e) e.stopPropagation();
    if (tabs.length <= 1) {
      dispatch({ type: appState.action, payload: "close" });
      return;
    }

    const targetIndex = tabs.findIndex((t) => t.id === targetTabId);
    const newTabs = tabs.filter((t) => t.id !== targetTabId);

    if (activeTabId === targetTabId) {
      const nextIndex = targetIndex >= newTabs.length ? newTabs.length - 1 : targetIndex;
      const nextTab = newTabs[nextIndex];
      setActiveTabId(nextTab.id);
      setInputValue(nextTab.url);
      setIsTyping(false);
    }
    setTabs(newTabs);
  };

  const switchTab = (tabId) => {
    setActiveTabId(tabId);
    const target = tabs.find((t) => t.id === tabId);
    if (target) {
      setInputValue(target.url);
      setIsTyping(false);
      setNtpSearchQuery("");
    }
  };

  const handleSearchOrNavigate = (rawQuery) => {
    const qry = rawQuery.trim();
    if (!qry) return;

    let target = "";
    if (isValidURL(qry)) {
      target = qry.startsWith("http://") || qry.startsWith("https://") ? qry : `https://${qry}`;
    } else {
      target = `https://www.google.com/search?igu=1&q=${encodeURIComponent(qry)}`;
    }
    navigateTo(target);
  };

  const handleOmniboxKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchOrNavigate(inputValue);
      e.target.blur();
    }
  };

  const handleNtpSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchOrNavigate(ntpSearchQuery);
    }
  };

  const handleAddShortcut = () => {
    const siteUrl = prompt("Enter website URL (e.g. reddit.com):");
    if (!siteUrl) return;
    const cleanUrl = siteUrl.trim();
    const domain = getDomain(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`);
    const name = prompt("Enter shortcut name:", domain) || domain;
    const fullUrl = cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`;
    const next = [...shortcuts, { name, url: fullUrl }];
    setShortcuts(next);
    try {
      localStorage.setItem("chrome_shortcuts", JSON.stringify(next));
    } catch {}
  };

  const goBack = () => {
    if (activeTab.histIndex > 0) {
      const newIndex = activeTab.histIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.id === activeTab.id
            ? {
                ...t,
                url: prevUrl,
                title: getSiteTitle(prevUrl),
                histIndex: newIndex,
                ierror: false,
              }
            : t
        )
      );
      setInputValue(prevUrl);
      setIsTyping(false);
    }
  };

  const goForward = () => {
    if (activeTab.histIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.histIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.id === activeTab.id
            ? {
                ...t,
                url: nextUrl,
                title: getSiteTitle(nextUrl),
                histIndex: newIndex,
                ierror: false,
              }
            : t
        )
      );
      setInputValue(nextUrl);
      setIsTyping(false);
    }
  };

  const reloadPage = () => {
    const frame = iframeRefs.current[activeTab.id];
    if (frame && activeTab.url) {
      frame.src = frame.src;
    }
  };

  const goHome = () => {
    navigateTo("");
  };

  const setTabIerror = (tabId, error) => {
    setTabs((prevTabs) =>
      prevTabs.map((t) => (t.id === tabId ? { ...t, ierror: error } : t))
    );
  };

  useEffect(() => {
    if (appState.url) {
      if (!activeTab.url || activeTab.url === "" || activeTab.url === "chrome://newtab") {
        navigateTo(appState.url);
      } else {
        openNewTab(appState.url);
      }
      dispatch({ type: "CHROMELINK" });
    }
  }, [appState.url]);

  return (
    <div
      className="chromeBrowser floatTab dpShad"
      data-size={appState.size}
      data-max={appState.max}
      style={{
        ...(appState.size === "cstm" ? appState.dim : null),
        zIndex: appState.z,
      }}
      data-hide={appState.hide}
      id="chromeApp"
    >
      <ToolBar
        app={appState.action}
        icon={appState.icon || "chrome"}
        size={appState.size}
        name="Google Chrome"
        float
      />

      <div className="chrome-overTool">
        <div className="chrome-tab-bar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isTabNTP = !tab.url || tab.url === "" || tab.url === "chrome://newtab";
            return (
              <div
                key={tab.id}
                className={`chrome-tab ${isActive ? "active" : ""}`}
                onClick={() => switchTab(tab.id)}
                title={tab.title}
              >
                <div className="chrome-tab-icon">
                  {isTabNTP ? (
                    <Icon src="chrome" width={14} />
                  ) : (
                    <>
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${getDomain(tab.url)}&sz=32`}
                        alt=""
                        className="chrome-tab-favicon"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = "flex";
                          }
                        }}
                      />
                      <span className="chrome-tab-fallback-icon" style={{ display: "none" }}>
                        <Icon fafa="faGlobe" width={12} />
                      </span>
                    </>
                  )}
                </div>
                <div className="chrome-tab-title">{tab.title}</div>
                <div
                  className="chrome-tab-close"
                  onClick={(e) => closeTab(tab.id, e)}
                  title="Close tab"
                >
                  ✕
                </div>
              </div>
            );
          })}

          <div
            className="chrome-newtab-btn"
            onClick={() => openNewTab()}
            title="New tab"
          >
            <Icon fafa="faPlus" width={11} />
          </div>
        </div>
      </div>

      <div className="windowScreen flex flex-col">
        <div className="chrome-nav-bar">
          <div
            className={`chrome-nav-btn ${activeTab.histIndex === 0 ? "disabled" : ""}`}
            onClick={goBack}
            title="Click to go back"
          >
            <Icon fafa="faArrowLeft" width={13} />
          </div>

          <div
            className={`chrome-nav-btn ${
              activeTab.histIndex >= activeTab.history.length - 1 ? "disabled" : ""
            }`}
            onClick={goForward}
            title="Click to go forward"
          >
            <Icon fafa="faArrowRight" width={13} />
          </div>

          <div
            className="chrome-nav-btn"
            onClick={reloadPage}
            title="Reload this page"
          >
            <Icon fafa="faRedo" width={12} />
          </div>

          <div
            className="chrome-nav-btn"
            onClick={goHome}
            title="Open the home page"
          >
            <Icon fafa="faHome" width={14} />
          </div>

          <div
            className={`chrome-omnibox-container ${
              isOmniboxFocused ? "focused" : ""
            }`}
          >
            <div className="chrome-omnibox-icon">
              {isNTP ? (
                <Icon src="google" ui width={14} />
              ) : (
                <Icon fafa="faLock" width={11} />
              )}
            </div>

            <input
              type="text"
              className="chrome-omnibox-input"
              value={isTyping ? inputValue : (activeTab.url || "")}
              placeholder="Search Google or type a URL"
              onChange={(e) => {
                setIsTyping(true);
                setInputValue(e.target.value);
              }}
              onFocus={() => {
                setIsOmniboxFocused(true);
                setIsTyping(true);
                setInputValue(activeTab.url || "");
              }}
              onBlur={() => {
                setIsOmniboxFocused(false);
                setIsTyping(false);
              }}
              onKeyDown={handleOmniboxKeyDown}
            />

            <div className="chrome-omnibox-actions">
              <div
                className="action-icon"
                title="Bookmark this tab"
                onClick={() => alert("Tab bookmarked!")}
              >
                <Icon fafa="faStar" width={12} />
              </div>
            </div>
          </div>

          <div className="chrome-toolbar-right">
            <div className="chrome-nav-btn" title="Extensions">
              <Icon fafa="faPuzzlePiece" width={13} />
            </div>

            <div className="chrome-nav-btn" title="Customize and control Google Chrome">
              <Icon fafa="faEllipsisV" width={12} />
            </div>
          </div>
        </div>

        <div className="chrome-bookmarks-bar">
          {defaultBookmarks.map((bm, idx) => (
            <div
              key={idx}
              className="bookmark-item"
              onClick={() => navigateTo(bm.url)}
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${getDomain(bm.url)}&sz=32`}
                alt=""
                className="bookmark-favicon-img"
                style={{ width: "13px", height: "13px", marginRight: "6px" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span>{bm.name}</span>
            </div>
          ))}
        </div>

        <div className="restWindow flex-grow flex flex-col relative overflow-hidden">
          <LazyComponent show={!appState.hide}>
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const isTabNTP = !tab.url || tab.url === "" || tab.url === "chrome://newtab";

              return (
                <div
                  key={tab.id}
                  className={`chrome-tab-content w-full h-full flex flex-col ${
                    isActive ? "active" : "hidden"
                  }`}
                  style={{ display: isActive ? "flex" : "none" }}
                >
                  {isTabNTP ? (
                    <div className="chrome-ntp-container win11Scroll">
                      <div className="chrome-ntp-header">
                        <a
                          href="#gmail"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo("https://mail.google.com/");
                          }}
                        >
                          Gmail
                        </a>
                        <a
                          href="#images"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo("https://www.google.com/imghp?igu=1");
                          }}
                        >
                          Images
                        </a>
                        <div
                          className="ntp-header-icon"
                          title="Google apps"
                          onClick={() => handleSearchOrNavigate("Google apps")}
                        >
                          <Icon fafa="faTh" width={14} />
                        </div>
                      </div>

                      <div className="chrome-ntp-center">
                        <div className="chrome-google-logo">
                          <img
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
                            alt="Google"
                            className="google-logo-light"
                            width="272"
                            height="92"
                          />
                          <img
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png"
                            alt="Google"
                            className="google-logo-dark"
                            width="272"
                            height="92"
                          />
                        </div>

                        <div className="chrome-ntp-searchbar">
                          <div className="ntp-search-icon">
                            <Icon fafa="faSearch" width={15} />
                          </div>

                          <input
                            type="text"
                            className="ntp-search-input"
                            placeholder="Search Google or type a URL"
                            value={isActive ? ntpSearchQuery : ""}
                            onChange={(e) => setNtpSearchQuery(e.target.value)}
                            onKeyDown={handleNtpSearchKeyDown}
                          />
                        </div>

                        <div className="chrome-ntp-shortcuts">
                          {shortcuts.map((sc, i) => (
                            <div
                              key={i}
                              className="shortcut-card"
                              onClick={() => navigateTo(sc.url)}
                              title={sc.name}
                            >
                              <div className="shortcut-icon-circle">
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${getDomain(sc.url)}&sz=64`}
                                  alt={sc.name}
                                  className="shortcut-favicon-img"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = "block";
                                    }
                                  }}
                                />
                                <span
                                  className="shortcut-fallback-letter"
                                  style={{ display: "none" }}
                                >
                                  {sc.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="shortcut-label">{sc.name}</div>
                            </div>
                          ))}

                          <div
                            className="shortcut-card"
                            onClick={handleAddShortcut}
                            title="Add shortcut"
                          >
                            <div className="shortcut-icon-circle add-shortcut-circle">
                              <Icon fafa="faPlus" width={14} />
                            </div>
                            <div className="shortcut-label">Add shortcut</div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="chrome-customize-btn"
                        onClick={() =>
                          alert("Customize Chrome: Theme and colors are managed by Windows system preferences.")
                        }
                      >
                        <Icon fafa="faPen" width={11} />
                        <span>Customize Chrome</span>
                      </div>
                    </div>
                  ) : (
                    <div className="chrome-site-frame w-full h-full flex flex-col">
                      <iframe
                        ref={(el) => {
                          iframeRefs.current[tab.id] = el;
                        }}
                        src={tab.url}
                        frameBorder="0"
                        className="w-full h-full flex-grow"
                        title={tab.title}
                        onError={() => setTabIerror(tab.id, true)}
                      ></iframe>

                      {tab.ierror && (
                        <div className="chrome-connect-banner">
                          <div
                            className="banner-close"
                            onClick={() => setTabIerror(tab.id, false)}
                          >
                            ✕
                          </div>
                          <div className="banner-title">
                            Cannot connect inside frame
                          </div>
                          <div className="banner-desc">
                            This website restricts being displayed in an embedded
                            frame due to security policies (X-Frame-Options).
                          </div>
                          <div
                            className="banner-link"
                            onClick={() => window.open(tab.url, "_blank")}
                          >
                            Open in external window ↗
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </LazyComponent>
        </div>
      </div>
    </div>
  );
};
