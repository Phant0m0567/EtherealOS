import React, { useState, useEffect, useRef } from "react";

const Desktop = () => {
  const [menu, setMenu] = useState(null);
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState({ x: false, y: false });
  const [sub, setSub] = useState(null);
  const [subShow, setSubShow] = useState(false);
  const subTimer = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    const close = () => {
      setShow(false);
      setSubShow(false);
      setSub(null);
      clearTimeout(subTimer.current);
      setTimeout(() => setMenu(null), 120);
    };
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, []);

  useEffect(() => {
    if (menu) setShow(true);
  }, [menu]);

  useEffect(() => {
    if (sub) setSubShow(true);
  }, [sub]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(false);

    const rect = box.current
      ? box.current.getBoundingClientRect()
      : { width: 0, height: 0 };

    setFlip({
      x: e.clientX + rect.width > window.innerWidth,
      y: e.clientY + rect.height > window.innerHeight,
    });

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
    <div className="desktop" onContextMenu={handleContextMenu}>
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
            <span className="material-symbols-outlined">shelf_position</span>
            Always show shelf
          </div>
          <div
            className={"menuItem" + (sub ? " active" : "")}
            onMouseEnter={openSub}
            onMouseLeave={closeSub}
          >
            <span className="material-symbols-outlined">dock_to_bottom</span>
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
