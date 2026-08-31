import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Notepad = () => {
  const wnapp = useSelector((state) => state.apps.notepad);
  const files = useSelector((state) => state.files);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("Untitled - Notepad");

  const saveFile = () => {
    const textarea = document.getElementById("textpad");
    const content = textarea ? textarea.value : "";
    const defaultFolderId =
      files.data.special["%downloads%"] ||
      files.data.special["%documents%"] ||
      files.cdir;
    const folderId = files.cdir && files.data.getId(files.cdir) ? files.cdir : defaultFolderId;
    const currentPath =
      files.data.getPath(folderId || defaultFolderId || files.data.tree[0].id) ||
      "Downloads";
    const suggestedName = title.includes(" - Notepad")
      ? "Untitled.txt"
      : title.replace(" - Notepad", "") || "Untitled.txt";
    const fileName = window.prompt("Save file as:", suggestedName) || suggestedName;
    const safeName = fileName.trim() || "Untitled.txt";
    const finalName = safeName.toLowerCase().endsWith(".txt")
      ? safeName
      : `${safeName}.txt`;

    if (folderId) {
      dispatch({
        type: "FILESAVE",
        payload: {
          folderId,
          name: finalName,
          content,
        },
      });
      setTitle(`${finalName} - Notepad`);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `notepad:${finalName}`,
          JSON.stringify({ path: currentPath, content }),
        );
      }
    }
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveFile();
    }
  };

  return (
    <div
      className="notepad floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={title}
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex text-xs py-2 topBar">
          <div className="mx-2" onClick={saveFile} role="button" tabIndex={0}>
            File
          </div>
          <div className="mx-4">Edit</div>
          <div className="mx-4">View</div>
        </div>
        <div className="restWindow h-full flex-grow">
          <div className="w-full h-full overflow-hidden">
            <textarea
              className="noteText win11Scroll"
              id="textpad"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
