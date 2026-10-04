import { createStore, combineReducers } from "redux";

const initialShelf = {
  pinned: [
    { name: "Launcher", className: "launcher" },
    { name: "Google Chrome", className: "chrome" },
    { name: "Files", className: "file-explorer" },
    { name: "Text", className: "text-edittor" },
    { name: "Settings", className: "settings" },
  ],
  hidden: [
    {
      name: "Wallpaper & Background",
      className: "wallpaper-background",
    },
  ],
};

const shelf = (state = initialShelf, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default createStore(combineReducers({ shelf }));
