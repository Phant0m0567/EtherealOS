import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

const Desktop = () => {
  const [menu, setMenu] = useState(null);
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState({ x: false, y: false });
  const [sub, setSub] = useState(null);
  const [subShow, setSubShow] = useState(false);
  const subTimer = useRef(null);
  const box = useRef(null);
  const desktopRef = useRef(null);
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
      if (!desktopRef.current?.contains(event.target)) close();
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
    <div ref={desktopRef} className="desktop" onContextMenu={handleContextMenu}>
      {menu && (
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
        </div>
      )}
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
    </div>
  );
};

export default Desktop;
