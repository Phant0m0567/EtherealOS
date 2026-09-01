import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root"));
root.render(
  <Suspense
    fallback={
      <div id="sus-fallback">
        <h1></h1> {/* you can replace this later if needed with like loading or smth*/}
      </div>
    }
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>,
);
