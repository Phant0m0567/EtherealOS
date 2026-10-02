import React from "react";
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

  return (
    <div className="shelf">
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
    </div>
  );
};

export default Shelf;
