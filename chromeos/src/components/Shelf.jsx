import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

const StatusArea = () => {
  const now = new Date();
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="statusArea">
      <span className="quickPill micPill">
        <span className="material-symbols-outlined">mic</span>
      </span>
      <span className="quickPill datePill">{date}</span>
      <span className="quickPill timePill">
        {time}
        <span className="material-symbols-outlined">signal_wifi_4_bar</span>
        <span className="material-symbols-outlined">battery_full</span>
      </span>
    </div>
  );
};

const Shelf = () => {
  const pinned = useSelector((state) => state.shelf.pinned);
  const launcher = pinned.find((app) => app.icon === "launcher");
  const apps = pinned.filter((app) => app.icon !== "launcher");

  const [menu, setMenu] = useState(null);
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState({ x: false, y: false });
  const [sub, setSub] = useState(null);
  const [subShow, setSubShow] = useState(false);
  const subTimer = useRef(null);
  const box = useRef(null);
  const shelfRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const close = () => {
      setShow(false);
      setSubShow(false);
      setSub(null);
      clearTimeout(subTimer.current);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setMenu(null), 120);
    };
    const closeFromContextMenu = (event) => {
      if (!shelfRef.current?.contains(event.target)) close();
    };
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", closeFromContextMenu);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", closeFromContextMenu);
      clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (menu) setShow(true);
  }, [menu]);

  useEffect(() => {
    if (sub) setSubShow(true);
  }, [sub]);

  useLayoutEffect(() => {
    if (!menu || !box.current) return;
    const { width, height } = box.current.getBoundingClientRect();
    setFlip({
      x: menu.x + width > window.innerWidth,
      y: menu.y + height > window.innerHeight,
    });
  }, [menu]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    clearTimeout(closeTimer.current);
    setShow(false);
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMenuContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  const openSub = (e) => {
    clearTimeout(subTimer.current);
    const r = e.currentTarget.getBoundingClientRect();
    subTimer.current = setTimeout(() => {
      setSub({ x: flip.x ? r.left : r.right, y: r.top - 6 });
    }, 350);
  };

  const closeSub = () => {
    clearTimeout(subTimer.current);
    setSubShow(false);
    subTimer.current = setTimeout(() => setSub(null), 120);
  };

  const keepSub = () => {
    clearTimeout(subTimer.current);
    setSubShow(true);
  };

  return (
    <div ref={shelfRef} className="shelf" onContextMenu={handleContextMenu}>
      <div
        className="shelfApp"
        data-icon={launcher.icon}
        data-name={launcher.name}
      ></div>
      <div className="shelfApps">
        {apps.map((app, i) => (
          <React.Fragment key={i}>
            {app.icon === "settings" && <div className="shelfDivider" />}
            <div
              className="shelfApp"
              data-icon={app.icon}
              data-name={app.name}
            ></div>
          </React.Fragment>
        ))}
      </div>
      <StatusArea />

      {menu && createPortal(
        <>
        <div
          ref={box}
          className={
            "contextMenu" + (show ? " open" : "") + (flip.x ? " flipX" : "")
          }
          style={{
            top: menu.y,
            left: menu.x,
            transform: `translate(${flip.x ? "-100%" : "0"}, ${
              flip.y ? "-100%" : "0"
            })`,
          }}
          onClick={handleMenuClick}
          onContextMenu={handleMenuContextMenu}
        >
          <div className="menuItem">
            <span className="material-symbols-outlined">shelf_auto_hide</span>
            Autohide shelf
          </div>
          <div
            className={"menuItem" + (sub ? " active" : "")}
            onMouseEnter={openSub}
            onMouseLeave={closeSub}
          >
            <span className="material-symbols-outlined">shelf_position</span>
            Shelf position
            <span className="material-symbols-outlined menuChevron">
              chevron_right
            </span>
          </div>
          <div className="menuItem">
            <span className="material-symbols-outlined">brush</span>
            Set wallpaper &amp; style
          </div>
          <div className="menuItem">
            <span className="material-symbols-outlined">visibility</span>
            Show desk name
          </div>
        </div>
      {sub && (
        <div
          className={"subMenu" + (subShow ? " open" : "")}
          style={{
            top: sub.y,
            left: sub.x,
            transform: flip.x ? "translateX(-100%)" : "none",
          }}
          onMouseEnter={keepSub}
          onMouseLeave={closeSub}
          onContextMenu={handleMenuContextMenu}
        >
          <label className="subItem">
            <input type="radio" name="shelfSide" />
            Left
          </label>
          <label className="subItem">
            <input type="radio" name="shelfSide" defaultChecked />
            Bottom
          </label>
          <label className="subItem">
            <input type="radio" name="shelfSide" />
            Right
          </label>
        </div>
      )}
        </>,
        document.body
      )}
    </div>
  );
};

export default Shelf;
