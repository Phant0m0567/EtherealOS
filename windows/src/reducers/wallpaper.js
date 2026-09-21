const walls = [
  "default/img0.jpg",
  "dark/img0.jpg",
  "ThemeA/img0.jpg",
  "ThemeA/img1.jpg",
  "ThemeA/img2.jpg",
  "ThemeA/img3.jpg",
  "ThemeB/img0.jpg",
  "ThemeB/img1.jpg",
  "ThemeB/img2.jpg",
  "ThemeB/img3.jpg",
  "ThemeC/img0.jpg",
  "ThemeC/img1.jpg",
  "ThemeC/img2.jpg",
  "ThemeC/img3.jpg",
  "ThemeD/img0.jpg",
  "ThemeD/img1.jpg",
  "ThemeD/img2.jpg",
  "ThemeD/img3.jpg",
];

const normalizeWallIndex = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed >= walls.length) {
    return fallback;
  }
  return parsed;
};

var wps = normalizeWallIndex(localStorage.getItem("wps"), 0);
var locked = localStorage.getItem("locked");
var isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
var isLocked = isLocal ? true : locked === null ? true : locked === "true";

const themes = ["default", "dark", "ThemeA", "ThemeB", "ThemeD", "ThemeC"];

const defState = {
  themes: themes,
  wps: wps,
  src: walls[wps],
  locked: isLocked,
  booted: false || import.meta.env.MODE == "development",
  act: "",
  dir: 0,
};

const wallReducer = (state = defState, action) => {
  switch (action.type) {
    case "WALLUNLOCK":
      localStorage.setItem("locked", "false");
      return {
        ...state,
        locked: false,
        dir: 0,
      };
    case "WALLNEXT": {
      const currentIndex = normalizeWallIndex(state.wps, 0);
      const twps = (currentIndex + 1) % walls.length;
      localStorage.setItem("wps", twps);
      return {
        ...state,
        wps: twps,
        src: walls[twps],
      };
    }
    case "WALLALOCK":
      localStorage.setItem("locked", "true");
      return {
        ...state,
        locked: true,
        dir: -1,
      };
    case "WALLBOOTED":
      return {
        ...state,
        booted: true,
        dir: 0,
        act: "",
      };
    case "WALLRESTART":
      localStorage.setItem("locked", "true");
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "restart",
      };
    case "WALLSHUTDN":
      localStorage.setItem("locked", "true");
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "shutdn",
      };
    case "WALLSET": {
      const numericValue = Number.parseInt(action.payload, 10);
      const isIndex = !Number.isNaN(numericValue);
      let nextIndex = 0;
      let nextSrc = walls[0];

      if (isIndex) {
        nextIndex = normalizeWallIndex(numericValue, 0);
        nextSrc = walls[nextIndex];
      } else {
        const idx = walls.findIndex((item) => item === action.payload);
        nextIndex = idx >= 0 ? idx : 0;
        nextSrc = walls[nextIndex];
      }

      localStorage.setItem("wps", nextIndex);

      return {
        ...state,
        wps: nextIndex,
        src: nextSrc,
      };
    }
    default:
      return state;
  }
};

export default wallReducer;
