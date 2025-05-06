import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: "Xem nhà Quận 1",
      start: new Date(2025, 3, 25, 9, 0), // tháng 3 = tháng 4 (0-indexed)
      end: new Date(2025, 3, 25, 10, 0),
    },
    {
      title: "Xem biệt thự Quận 7",
      start: new Date(2025, 3, 26, 14, 0),
      end: new Date(2025, 3, 26, 15, 0),
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Nhập tiêu đề lịch hẹn:");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="mb-4">Lịch hẹn xem nhà</h3>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week"
        views={["month", "week", "day"]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          today: "Hôm nay",
          previous: "Trước",
          next: "Tiếp",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
          agenda: "Lịch biểu",
          date: "Ngày",
          time: "Thời gian",
          event: "Sự kiện",
        }}
      />
      <style jsx="true">{`
        .calendar-wrapper {
          width: 100%;
          height: 100%;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .rbc-event {
          background-color: #4e73df;
          border: none;
          border-radius: 4px;
          color: white;
          padding: 2px 4px;
        }

        .rbc-toolbar button {
          margin: 0 4px;
        }

        .rbc-toolbar-label {
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default AppointmentCalendar;
