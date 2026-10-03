import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

const AppTile = ({ app }) => (
  <div className="launcherTile">
    <span className={`launcherIcon ${app.className}`} aria-hidden="true">
    </span>
    <span className="launcherName">{app.name}</span>
  </div>
);

const Launcher = ({ name }) => {
  const apps = useSelector((state) =>
    state.shelf.pinned.filter((app) => app.className !== "launcher")
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (
        !launcherRef.current?.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", closeOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="shelfApp launcherButton"
        aria-label={name}
        aria-expanded={open}
        aria-controls="chromeLauncher"
        data-open={open}
        onClick={() => setOpen((value) => !value)}
      />
      {createPortal(
        <section
          ref={panelRef}
          id="chromeLauncher"
          className={`launcherPanel${open ? " open" : ""}`}
          aria-label="App launcher"
          aria-hidden={!open}
        >
          <label className="launcherSearch">
            <img src="/img/asset/google.png" alt="" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your settings, files, apps, and more..."
              tabIndex={open ? 0 : -1}
            />
          </label>
          <div className="launcherContent">
            <div className="launcherGrid">
              {filteredApps.map((app) => (
                <AppTile key={app.className} app={app} />
              ))}
            </div>
          </div>
        </section>,
        document.body
      )}
    </>
  );
};

export default Launcher;