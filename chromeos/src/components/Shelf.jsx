import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import Launcher from "./Launcher";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthBatchSize = 3;

const createMonthRange = (firstMonth, count) =>
  Array.from(
    { length: count },
    (_, index) =>
      new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1)
  );

const StatusArea = () => {
  const now = new Date();
  const monthOffset = monthBatchSize;
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  })
    .formatToParts(now)
    .filter((part) => part.type !== "dayPeriod")
    .map((part) => part.value)
    .join("")
    .trim();
  const date = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [months, setMonths] = useState(() =>
    createMonthRange(
      new Date(now.getFullYear(), now.getMonth() - monthOffset, 1),
      monthOffset * 2 + 1
    )
  );
  const [visibleMonthIndex, setVisibleMonthIndex] = useState(monthOffset);
  const [selectedDate, setSelectedDate] = useState(now);
  const dateButtonRef = useRef(null);
  const calendarRef = useRef(null);
  const monthListRef = useRef(null);
  const monthRefs = useRef([]);
  const isExtendingMonths = useRef(false);
  const pendingScrollAdjustment = useRef(0);
  const pendingMonthIndex = useRef(null);
  const visibleMonth = months[visibleMonthIndex];
  const monthFormatter = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  });
  const monthOnlyFormatter = new Intl.DateTimeFormat(undefined, {
    month: "long",
  });
  const monthLabel = monthFormatter.format(visibleMonth);
  const dayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useLayoutEffect(() => {
    if (!calendarOpen) return;
    const currentMonthIndex = months.findIndex(
      (month) =>
        month.getFullYear() === now.getFullYear() &&
        month.getMonth() === now.getMonth()
    );
    if (currentMonthIndex < 0) return;
    setVisibleMonthIndex(currentMonthIndex);
    const currentMonth = monthRefs.current[currentMonthIndex];
    if (monthListRef.current && currentMonth) {
      monthListRef.current.scrollTop = currentMonth.offsetTop;
    }
  }, [calendarOpen]);

  useLayoutEffect(() => {
    const monthList = monthListRef.current;
    if (!monthList) return;
    if (pendingScrollAdjustment.current) {
      monthList.scrollTop += pendingScrollAdjustment.current;
      pendingScrollAdjustment.current = 0;
    }
    if (pendingMonthIndex.current !== null) {
      const targetMonth = monthRefs.current[pendingMonthIndex.current];
      if (targetMonth) {
        setVisibleMonthIndex(pendingMonthIndex.current);
        monthList.scrollTo({ top: targetMonth.offsetTop, behavior: "smooth" });
      }
      pendingMonthIndex.current = null;
    }
    isExtendingMonths.current = false;
  }, [months]);

  useEffect(() => {
    if (!calendarOpen) return;
    const closeOutside = (event) => {
      if (
        !calendarRef.current?.contains(event.target) &&
        !dateButtonRef.current?.contains(event.target)
      ) {
        setCalendarOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        dateButtonRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", closeOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [calendarOpen]);

  const changeMonth = (amount) => {
    const nextIndex = visibleMonthIndex + amount;
    if (nextIndex < 0) {
      if (isExtendingMonths.current) return;
      pendingMonthIndex.current = monthBatchSize - 1;
      prependMonths();
      return;
    }
    if (nextIndex >= months.length) {
      if (isExtendingMonths.current) return;
      pendingMonthIndex.current = months.length - monthBatchSize;
      appendMonths();
      return;
    }
    const nextMonth = monthRefs.current[nextIndex];
    setVisibleMonthIndex(nextIndex);
    if (monthListRef.current && nextMonth) {
      monthListRef.current.scrollTo({
        top: nextMonth.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const prependMonths = () => {
    const monthList = monthListRef.current;
    if (!monthList || isExtendingMonths.current) return;
    isExtendingMonths.current = true;
    pendingScrollAdjustment.current =
      monthList.clientHeight * monthBatchSize;
    setMonths((currentMonths) => {
      const firstMonth = currentMonths[0];
      const firstAddedMonth = new Date(
        firstMonth.getFullYear(),
        firstMonth.getMonth() - monthBatchSize,
        1
      );
      return [
        ...createMonthRange(firstAddedMonth, monthBatchSize),
        ...currentMonths.slice(0, -monthBatchSize),
      ];
    });
    setVisibleMonthIndex((index) => index + monthBatchSize);
  };

  const appendMonths = () => {
    const monthList = monthListRef.current;
    if (!monthList || isExtendingMonths.current) return;
    isExtendingMonths.current = true;
    pendingScrollAdjustment.current =
      -monthList.clientHeight * monthBatchSize;
    setMonths((currentMonths) => {
      const lastMonth = currentMonths[currentMonths.length - 1];
      const firstAddedMonth = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth() + 1,
        1
      );
      return [
        ...currentMonths.slice(monthBatchSize),
        ...createMonthRange(firstAddedMonth, monthBatchSize),
      ];
    });
    setVisibleMonthIndex((index) => index - monthBatchSize);
  };

  const handleMonthScroll = () => {
    const monthList = monthListRef.current;
    if (!monthList?.clientHeight) return;
    const listTop = monthList.getBoundingClientRect().top + 16;
    let nextIndex = 0;
    for (let index = 0; index < monthRefs.current.length; index += 1) {
      const month = monthRefs.current[index];
      if (month?.getBoundingClientRect().bottom > listTop) {
        nextIndex = index;
        break;
      }
    }
    setVisibleMonthIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex
    );
    if (isExtendingMonths.current) return;
    const monthHeight = monthList.clientHeight;
    if (monthList.scrollTop < monthHeight * 2) {
      prependMonths();
    } else if (
      monthList.scrollHeight - monthList.scrollTop - monthList.clientHeight <
      monthHeight * 2
    ) {
      appendMonths();
    }
  };

  return (
    <div className="statusArea">
      <span className="quickPill micPill">
        <span className="material-symbols-outlined">mic</span>
      </span>
      <button
        ref={dateButtonRef}
        type="button"
        className="quickPill datePill"
        aria-label={`Open calendar, ${date}`}
        aria-haspopup="dialog"
        aria-expanded={calendarOpen}
        aria-controls="shelfCalendar"
        onClick={() => setCalendarOpen((open) => !open)}
      >
        {date}
      </button>
      <span className="quickPill timePill">
        {time}
        <span className="material-symbols-outlined">signal_wifi_4_bar</span>
        <span className="material-symbols-outlined">battery_full</span>
      </span>
      {calendarOpen && (
        <section
          ref={calendarRef}
          id="shelfCalendar"
          className="calendarPopover"
          role="dialog"
          aria-label={`Calendar, ${monthLabel}`}
        >
          <div className="calendarMonthRow">
            <h2 aria-live="polite">{monthLabel}</h2>
            <div className="calendarNavigation">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  keyboard_arrow_up
                </span>
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  keyboard_arrow_down
                </span>
              </button>
            </div>
          </div>
          <div className="calendarWeekdays">
            {weekdays.map((weekday) => (
              <span key={weekday} aria-label={weekday}>
                {weekday[0]}
              </span>
            ))}
          </div>
          <div ref={monthListRef} className="calendarMonths" onScroll={handleMonthScroll}>
            {months.map((month, monthIndex) => {
              const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
              const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
              const monthDays = Array.from({ length: dayCount }, (_, index) => index + 1);
              return (
                <div
                  key={`${month.getFullYear()}-${month.getMonth()}`}
                  ref={(element) => {
                    monthRefs.current[monthIndex] = element;
                  }}
                  className="calendarMonth"
                >
                  <h3 className="calendarMonthName">
                    {monthOnlyFormatter.format(month)}
                  </h3>
                  <div className="calendarDays">
                    {Array.from({ length: monthStart.getDay() }, (_, index) => (
                      <span
                        key={`blank-${index}`}
                        className="calendarDaySpacer"
                        aria-hidden="true"
                      />
                    ))}
                    {monthDays.map((dayNumber) => {
                      const day = new Date(
                        month.getFullYear(),
                        month.getMonth(),
                        dayNumber
                      );
                      const selected = day.toDateString() === selectedDate.toDateString();
                      const today = day.toDateString() === now.toDateString();
                      const className = [
                        "calendarDay",
                        selected ? "selected" : "",
                        today ? "today" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          className={className}
                          aria-label={dayLabel.format(day)}
                          aria-pressed={selected}
                          aria-current={today ? "date" : undefined}
                          onClick={() => setSelectedDate(day)}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

const Shelf = () => {
  const pinned = useSelector((state) => state.shelf.pinned);
  const launcher = pinned.find((app) => app.className === "launcher");
  const apps = pinned.filter((app) => app.className !== "launcher");

  const [menu, setMenu] = useState(null);
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState({ x: false, y: false });
  const [sub, setSub] = useState(null);
  const [subShow, setSubShow] = useState(false);
  const subTimer = useRef(null);
  const box = useRef(null);
  const shelfRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const close = () => {
      setShow(false);
      setSubShow(false);
      setSub(null);
      clearTimeout(subTimer.current);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setMenu(null), 120);
    };
    const closeFromContextMenu = (event) => {
      if (!shelfRef.current?.contains(event.target)) close();
    };
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", closeFromContextMenu);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", closeFromContextMenu);
      clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (menu) setShow(true);
  }, [menu]);

  useEffect(() => {
    if (sub) setSubShow(true);
  }, [sub]);

  useLayoutEffect(() => {
    if (!menu || !box.current) return;
    const { width, height } = box.current.getBoundingClientRect();
    setFlip({
      x: menu.x + width > window.innerWidth,
      y: menu.y + height > window.innerHeight,
    });
  }, [menu]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    clearTimeout(closeTimer.current);
    setShow(false);
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMenuContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  const openSub = (e) => {
    clearTimeout(subTimer.current);
    const r = e.currentTarget.getBoundingClientRect();
    subTimer.current = setTimeout(() => {
      setSub({ x: flip.x ? r.left : r.right, y: r.top - 6 });
    }, 350);
  };

  const closeSub = () => {
    clearTimeout(subTimer.current);
    setSubShow(false);
    subTimer.current = setTimeout(() => setSub(null), 120);
  };

  const keepSub = () => {
    clearTimeout(subTimer.current);
    setSubShow(true);
  };

  return (
    <div ref={shelfRef} className="shelf" onContextMenu={handleContextMenu}>
      <Launcher name={launcher.name} />
      <div className="shelfApps">
        {apps.map((app, i) => (
          <React.Fragment key={i}>
            {app.className === "settings" && <div className="shelfDivider" />}
            <div
              className={`shelfApp ${app.className}`}
              role="img"
              aria-label={app.name}
            />
          </React.Fragment>
        ))}
      </div>
      <StatusArea />

      {menu && createPortal(
        <>
        <div
          ref={box}
          className={
            "contextMenu" + (show ? " open" : "") + (flip.x ? " flipX" : "")
          }
          style={{
            top: menu.y,
            left: menu.x,
            transform: `translate(${flip.x ? "-100%" : "0"}, ${
              flip.y ? "-100%" : "0"
            })`,
          }}
          onClick={handleMenuClick}
          onContextMenu={handleMenuContextMenu}
        >
          <div className="menuItem">
            <span className="material-symbols-outlined">shelf_auto_hide</span>
            Autohide shelf
          </div>
          <div
            className={"menuItem" + (sub ? " active" : "")}
            onMouseEnter={openSub}
            onMouseLeave={closeSub}
          >
            <span className="material-symbols-outlined">shelf_position</span>
            Shelf position
            <span className="material-symbols-outlined menuChevron">
              chevron_right
            </span>
          </div>
          <div className="menuItem">
            <span className="material-symbols-outlined">brush</span>
            Set wallpaper &amp; style
          </div>
          <div className="menuItem">
            <span className="material-symbols-outlined">visibility</span>
            Show desk name
          </div>
        </div>
      {sub && (
        <div
          className={"subMenu" + (subShow ? " open" : "")}
          style={{
            top: sub.y,
            left: sub.x,
            transform: flip.x ? "translateX(-100%)" : "none",
          }}
          onMouseEnter={keepSub}
          onMouseLeave={closeSub}
          onContextMenu={handleMenuContextMenu}
        >
          <label className="subItem">
            <input type="radio" name="shelfSide" />
            Left
          </label>
          <label className="subItem">
            <input type="radio" name="shelfSide" defaultChecked />
            Bottom
          </label>
          <label className="subItem">
            <input type="radio" name="shelfSide" />
            Right
          </label>
        </div>
      )}
        </>,
        document.body
      )}
    </div>
  );
};

export default Shelf;
