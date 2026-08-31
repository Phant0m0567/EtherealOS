import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as monaco from "monaco-editor";
import { ToolBar } from "../../utils/general";

export const IFrame = (props) => {
  const wnapp = useSelector((state) => state.apps[props.icon]);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  if (!wnapp) return null;
  const data = wnapp.data || {};

  useEffect(() => {
    if (!containerRef.current || !editorRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: data.code || data.value || "console.log('Hello from Monaco');\n",
      language: data.language || "javascript",
      theme: data.invert === true ? "vs-dark" : "vs-light",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: "on",
      scrollBeyondLastLine: false,
    });

    editorRef.current = editor;

    return () => editor.dispose();
  }, [data.code, data.value, data.language, data.invert]);

  return wnapp.hide ? null : (
    <div
      data-size={wnapp.size}
      className={
        "floatTab dpShad " +
        (data.invert != true ? "lightWindow" : "darkWindow")
      }
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
        name={wnapp.name || "Code"}
        invert={data.invert == true ? true : null}
        noinvert
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow overflow-hidden" ref={containerRef} />
        </div>
      </div>
    </div>
  );
};
