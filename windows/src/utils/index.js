import icons from "./apps";

const sanitizeAppList = (list = []) =>
  Array.isArray(list)
    ? list.filter((name) => name && name !== "Buy me a coffee")
    : [];

var { taskbar, desktop, pinned, recent } = {
  taskbar: sanitizeAppList(
    (localStorage.getItem("taskbar") && JSON.parse(localStorage.getItem("taskbar"))) || [
      "Settings",
      "File Explorer",
      "Microsoft Edge",
      "Store",
      "Spotify",
    ],
  ),
  desktop: sanitizeAppList(
    (localStorage.getItem("desktop") && JSON.parse(localStorage.getItem("desktop"))) || [
      "Guest",
      "Recycle Bin",
      "File Explorer",
      "Store",
      "Microsoft Edge",
      "Github",
      "Spotify",
    ],
  ),
  pinned: sanitizeAppList(
    (localStorage.getItem("pinned") && JSON.parse(localStorage.getItem("pinned"))) || [
      "Microsoft Edge",
      "Get Started",
      "Task Manager",
      "Mail",
      "Settings",
      "Store",
      "Notepad",
      "Whiteboard",
      "Calculator",
      "Spotify",
      "Twitter",
      "File Explorer",
      "Terminal",
      "PowerShell",
      "Github",
      "Discord",
      "Camera",
    ],
  ),
  recent: sanitizeAppList(
    (localStorage.getItem("recent") && JSON.parse(localStorage.getItem("recent"))) || [
      "Mail",
      "Twitter",
      "Terminal",
      "Github",
      "File Explorer",
      "Spotify",
      "Edge",
    ],
  ),
};

if (typeof localStorage !== "undefined") {
  localStorage.setItem("desktop", JSON.stringify(desktop));
  localStorage.setItem("pinned", JSON.stringify(pinned));
  localStorage.setItem("taskbar", JSON.stringify(taskbar));
  localStorage.setItem("recent", JSON.stringify(recent));
}

export const taskApps = icons.filter((x) => taskbar.includes(x.name));

export const desktopApps = icons
  .filter((x) => desktop.includes(x.name))
  .sort((a, b) => {
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  });

export const pinnedApps = icons
  .filter((x) => pinned.includes(x.name))
  .sort((a, b) => {
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  });

export const recentApps = icons
  .filter((x) => recent.includes(x.name))
  .sort((a, b) => {
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  });

export const allApps = icons.filter((app) => {
  return app.type === "app";
});

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};
