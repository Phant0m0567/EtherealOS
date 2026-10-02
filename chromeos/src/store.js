import { createStore, combineReducers } from "redux";

const initialShelf = {
  pinned: [
    { name: "Launcher", icon: "launcher" },
    { name: "Google Chrome", icon: "chrome" },
    { name: "Files", icon: "files" },
    { name: "Settings", icon: "settings" },
  ],
};

const shelf = (state = initialShelf, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default createStore(combineReducers({ shelf }));
