import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import { useTranslation } from "react-i18next";

export const Camera = () => {
  const wnapp = useSelector((state) => state.apps.camera);
  const hide = useSelector((state) => state.apps.camera.hide);
  const files = useSelector((state) => state.files);
  const dispatch = useDispatch();
  const [stream, setStream] = useState(null);
  const { t } = useTranslation();

  const capture = () => {
    var video = document.getElementById("camvideo");
    var canvas = document.getElementById("camcanvas");

    if (!video || !canvas || video.readyState < 2) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const delta = width - height;
    ctx.drawImage(video, -delta / 2, 0, width + delta, height);

    const dataUrl = canvas.toDataURL("image/png");
    const timestamp = new Date()
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[/: ]/g, "-")
      .replace(/,/g, "");
    const fileName = `Camera-${timestamp}.png`;
    const targetFolderId =
      files.data.special["%pictures%"] ||
      files.data.special["%downloads%"] ||
      files.data.special["%documents%"] ||
      files.data.special["%user%"];

    if (targetFolderId) {
      dispatch({
        type: "FILESAVE",
        payload: {
          folderId: targetFolderId,
          name: fileName,
          content: dataUrl,
        },
      });
      dispatch({ type: "FILEDIR", payload: targetFolderId });
    }
  };

  useEffect(() => {
    if (!wnapp.hide) {
      var video = document.getElementById("camvideo");

      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");

      var constraints = {
        audio: false,
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((dstream) => {
        setStream(dstream);
        console.log(dstream);
        video.srcObject = dstream;
      });
    } else {
      if (stream != null) stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [hide]);

  return (
    <div
      className="wnCam floatTab dpShad"
      data-size={wnapp.size}
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Camera"
        invert
        bg="#060606"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="camcont">
            <div className="camctrl">
              <div
                className="cmicon"
                title={t("camera.take-photo")}
                onClick={capture}
              >
                <Icon icon="camera" />
              </div>
              <canvas id="camcanvas"></canvas>
            </div>
            <div className="vidcont">
              <div className="vidwrap">
                <video id="camvideo"></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
