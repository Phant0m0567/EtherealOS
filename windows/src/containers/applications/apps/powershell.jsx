import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import login from "../../../components/login";
import { installApp, delApp } from "../../../actions";
import { ToolBar } from "../../../utils/general";
import dirs from "./assets/dir.json";

export const WnPowerShell = () => {
  const wnapp = useSelector((state) => state.apps.powershell);

  if (!wnapp) return null;
  const [stack, setStack] = useState([
    "Windows PowerShell",
    "Copyright (C) Microsoft Corporation. All rights reserved.",
    "",
  ]);
  const [pwd, setPwd] = useState("C:\\Users\\Guest");
  const [lastCmd, setLsc] = useState(0);
  const [wntitle, setWntitle] = useState("PowerShell");
  const files = useSelector((state) => state.files);
  const cmdInputRef = useRef(null);
  const cmdContRef = useRef(null);
  const cmdInputId = useRef(`curcmd-powershell-${Math.random().toString(36).slice(2)}`);
  const cmdContId = useRef(`cmdcont-powershell-${Math.random().toString(36).slice(2)}`);

  const dispatch = useDispatch();

  const normalizePath = (value) => {
    if (!value) return "C:\\";
    var path = value.replace(/\//g, "\\");
    if (path === "C:" || path === "C:\\") return "C:\\";
    path = path.replace(/\\{2,}/g, "\\");
    return path.replace(/\\+$/, "") || "C:\\";
  };

  const resolveDirPath = (target) => {
    var base = normalizePath(pwd);
    var arg = normalizePath(target);

    if (arg === ".") return base;
    if (arg === "..") {
      var parts = base.split("\\").filter(Boolean);
      if (parts.length <= 1) return "C:\\";
      parts.pop();
      return "C:\\" + parts.slice(1).join("\\");
    }

    if (!/^[A-Za-z]:/.test(arg)) {
      arg = (base === "C:\\" ? "C:\\" : base + "\\") + arg.replace(/^\\+/, "");
    }

    var id = files.data.parsePath(arg);
    if (!id) return null;

    var folder = files.data.getId(id);
    if (!folder || folder.type !== "folder") return null;

    return files.data.getPath(id);
  };

  const dirFolders = (targetPath = pwd) => {
    var resolvedPath = resolveDirPath(targetPath);
    if (!resolvedPath) return [];

    var id = files.data.parsePath(resolvedPath);
    var folder = id ? files.data.getId(id) : null;
    if (!folder || folder.type !== "folder") return [];

    return (folder.data || []).map((item) => item.name);
  };

  const cmdTool = async (cmd) => {
    var tmpStack = [...stack];
    tmpStack.push("PS " + pwd + "> " + cmd);

    var arr = cmd.split(/\s+/),
      type = (arr[0] || "").trim().toLowerCase(),
      arg = arr.splice(1, arr.length).join(" ") || "";

    arg = arg.trim();

    if (type == "") {
    } else if (type == "echo" || type == "write-host") {
      if (arg.length) {
        tmpStack.push(arg);
      } else {
        tmpStack.push("Hello, World!");
      }
    } else if (type == "get-childitem" || type == "ls" || type == "dir") {
      tmpStack.push("    Directory: " + pwd);
      tmpStack.push("");
      tmpStack.push("Mode                 LastWriteTime     Length Name");
      tmpStack.push("----                 -------------     ------ ----");

      var tdir = dirFolders();
      for (var i = 0; i < tdir.length; i++) {
        if (!tdir[i].includes(".")) {
          tmpStack.push("d----        " + new Date().toLocaleDateString() + "  <DIR>          " + tdir[i]);
        } else {
          tmpStack.push("-a---        " + new Date().toLocaleDateString() + "  0          " + tdir[i]);
        }
      }
    } else if (type == "set-location" || type == "cd") {
      if (arg.length) {
        var resolved = resolveDirPath(arg);
        if (resolved) {
          setPwd(resolved);
        } else if (arg == ".") {
          // keep current directory
        } else if (arg.includes(".")) {
          tmpStack.push("The directory name is invalid.");
        } else {
          tmpStack.push("The system cannot find the path specified.");
        }
      } else {
        tmpStack.push(pwd);
      }
    } else if (type == "get-location" || type == "pwd") {
      tmpStack.push(pwd);
    } else if (type == "clear-host" || type == "cls") {
      tmpStack = [];
    } else if (type == "get-date" || type == "date") {
      tmpStack.push("The current date is: " + new Date().toLocaleDateString());
    } else if (type == "get-time" || type == "time") {
      tmpStack.push(
        "The current time is: " +
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
      );
    } else if (type == "whoami") {
      tmpStack.push("guest\\user");
    } else if (type == "hostname") {
      tmpStack.push("BLUE");
    } else if (type == "start-process" || type == "start") {
      dispatch({ type: "EDGELINK", payload: arg });
    } else if (type == "get-computerinfo" || type == "systeminfo") {
      var dvInfo = [
        "Host Name:                 BLUE",
        "OS Name:                   Win11React Dummy Edition",
        "OS Version:                10.0.22000 N/A Build 22000.51",
        "OS Manufacturer:           Microsoft Corporation",
        "OS Configuration:          Standalone Workstation",
        "OS Build Type:             Multiprocessor Free",
        "Registered Owner:          Guest",
        "Registered Organization:   N/A",
        "Product ID:                7H1S1-5AP1R-473DV-3R5I0N",
      ];

      for (var i = 0; i < dvInfo.length; i++) {
        tmpStack.push(dvInfo[i]);
      }
    } else if (type == "exit") {
      tmpStack = [
        "Windows PowerShell",
        "Copyright (C) Microsoft Corporation. All rights reserved.",
        "",
      ];
      dispatch({ type: wnapp.action, payload: "close" });
    } else if (type == "title") {
      setWntitle(arg.length ? arg : "PowerShell");
    } else if (type == "login") {
      login();
      tmpStack.push("started login");
    } else if (type == "dev") {
      tmpStack.push("https://dev.blueedge.me/");
    } else if (type == "ver") {
      tmpStack.push("Windows PowerShell 10.0 - A Windows shell environment");
    } else if (type == "get-process" || type == "ps") {
      tmpStack.push("Handles  NPM(K)    PM(M)      WS(M)     CPU(s)     Id  ProcessName");
      tmpStack.push("-------  ------    -----      -----     ------     --  -----------");
      tmpStack.push("    117      10      2.56       8.41       0.00   1120  powershell");
      tmpStack.push("    211      25      8.96      19.50       0.01   1452  explorer");
      tmpStack.push("    179      12      3.40      10.24       0.00    502  chrome");
    } else if (type == "install") {
      if (arg.length) {
        tmpStack.push("Installing app");
        var appArgs = arg.toString().split(" ");
        var AppName = appArgs[0];
        var IframeUrl = appArgs[1];
        var IconUrl = appArgs[2];
        var Json = {
          name: AppName,
          icon: IconUrl,
          type: "game",
          data: {
            type: "IFrame",
            url: IframeUrl,
            invert: true,
          },
        };
        installApp(Json);
        tmpStack.push("App installed");
      }
    } else if (type == "uninstall") {
      if (arg.length) {
        tmpStack.push("Uninstalling app");
        var appArgs = arg.toString().split(" ");
        var AppName = appArgs[0];
        tmpStack.push(AppName);
        var apps = document.getElementsByClassName("dskApp");
        var Mainmenu = "";
        for (let i = 0; i < apps.length; i++) {
          var app = apps[i];
          var Appcname = app.getElementsByClassName("appName")[0];
          var menu = app.getElementsByClassName("uicon")[0];
          if (Appcname.innerHTML == AppName) {
            Mainmenu = menu;
          }
        }

        delApp("delete", Mainmenu);
        tmpStack.push("App uninstalled");
      }
    } else if (type == "get-help" || type == "help") {
      var helpArr = [
        "Get-ChildItem     Lists the items in a directory.",
        "Get-Location      Displays the current location.",
        "Set-Location      Changes the current location.",
        "Clear-Host        Clears the screen.",
        "Get-Date          Displays the current date.",
        "Get-Time          Displays the current time.",
        "Write-Host        Writes text to the host.",
        "WhoAmI            Displays the current user.",
        "Get-Process       Lists running processes.",
        "Get-ComputerInfo  Displays system information.",
        "Get-Help          Displays help for PowerShell commands.",
        "Exit              Exits the PowerShell session.",
        "Title             Sets the title for the window.",
      ];

      for (var i = 0; i < helpArr.length; i++) {
        tmpStack.push(helpArr[i]);
      }
    } else if (type == "get-command") {
      tmpStack.push("Get-ChildItem");
      tmpStack.push("Get-Location");
      tmpStack.push("Set-Location");
      tmpStack.push("Clear-Host");
      tmpStack.push("Get-Date");
      tmpStack.push("Get-Process");
      tmpStack.push("Get-Help");
      tmpStack.push("Write-Host");
      tmpStack.push("WhoAmI");
      tmpStack.push("Exit");
    } else if (type == "ipconfig") {
      tmpStack.push("Windows IP Configuration");
      tmpStack.push("");
      tmpStack.push("IPv6: " + (window.location?.hostname || "localhost"));
      tmpStack.push("Network: Local environment");
      tmpStack.push("City: Localhost");
      tmpStack.push("Region: In-App");
    } else {
      tmpStack.push(
        `'${arr[0]}' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
      );
      tmpStack.push(
        "Check the spelling of the name, or if a path was included, verify that the path is correct and try again.",
      );
      tmpStack.push("");
      tmpStack.push("Type 'Get-Help' for more information.");
    }

    if (type.length > 0) tmpStack.push("");
    setStack(tmpStack);
  };

  const action = (event) => {
    var cmdline = cmdInputRef.current;
    var action = event.target.dataset.action;

    if (cmdline) {
      if (action == "hover") {
        var crline = cmdline.parentNode;
        var cmdcont = cmdContRef.current;
        if (crline && cmdcont) {
          cmdcont.scrollTop = crline.offsetTop;
        }
        cmdline.focus();
      } else if (action == "enter") {
        if (event.key == "Enter") {
          event.preventDefault();
          var tmpStack = [...stack];
          var cmd = event.target.innerText.trim();
          event.target.innerText = "";
          setLsc(tmpStack.length + 1);
          cmdTool(cmd);
        } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
          event.preventDefault();
          var i = lastCmd + [1, -1][Number(event.key == "ArrowUp")];

          while (i >= 0 && i < stack.length) {
            if (stack[i].includes(">")) {
              var tp = stack[i].split(">");
              event.target.innerText = (tp[1] || "").trim();
              setLsc(i);
              break;
            }

            i += [1, -1][Number(event.key == "ArrowUp")];
          }

          cmdline.focus();
        } else if (event.key == "Tab") {
          event.preventDefault();
          var cmd = event.target.innerText.trim(),
            arr = cmd.split(" ");
          var arg = arr.splice(1, arr.length).join(" ") || "";

          var tdir = dirFolders();
          for (var i = 0; i < tdir.length; i++) {
            if (
              arg.length &&
              tdir[i].toLowerCase().startsWith(arg.toLowerCase())
            ) {
              event.target.innerText = arr[0] + " " + tdir[i];
              break;
            }
          }
        }
      }
      cmdline.focus();
    }
  };

  useEffect(() => {
    if (wnapp.dir && wnapp.dir != pwd) {
      setPwd(wnapp.dir);
    }
  });

  return (
    <div
      className="wnterm floatTab dpShad"
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
        name={wntitle}
        invert
        bg="#0B5FB7"
      />
      <div className="windowScreen flex" data-dock="true">
        <div className="restWindow h-full flex-grow text-gray-100">
          <div
            className="cmdcont w-full box-border overflow-y-scroll win11Scroll"
            id={cmdContId.current}
            ref={cmdContRef}
            onMouseOver={action}
            onClick={action}
            data-action="hover"
            style={{ pointerEvents: "auto" }}
          >
            <div className="w-full h-max pb-12">
              {stack.map((x, i) => (
                <pre key={i} className="cmdLine">
                  {x}
                </pre>
              ))}
              <div className="cmdLine actmd">
                PS {pwd}&gt;
                <div
                  className="ipcmd"
                  id={cmdInputId.current}
                  ref={cmdInputRef}
                  contentEditable
                  data-action="enter"
                  onKeyDown={action}
                  spellCheck="false"
                  style={{
                    pointerEvents: "auto",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    cursor: "text",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
