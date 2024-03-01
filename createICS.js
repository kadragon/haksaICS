function createICS(events) {
  const icsHeader = `BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//Your Organization//EN
  CALSCALE:GREGORIAN
  BEGIN:VTIMEZONE
  TZID:Asia/Seoul
  END:VTIMEZONE
  `;

  const icsFooter = `END:VCALENDAR`;

  const icsEvents = events
    .map((event) => {
      const dtStart = event.startDate.replace(/-/g, "");
      const dtEnd = event.endDate.replace(/-/g, "");
      // Note: DTEND in iCalendar is exclusive, so for single day events, it should be the next day
      const dtEndNextDay = new Date(event.endDate);
      dtEndNextDay.setDate(dtEndNextDay.getDate() + 1);
      const dtEndFormatted = dtEndNextDay
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

      return `BEGIN:VEVENT
  DTSTART;VALUE=DATE:${dtStart}
  DTEND;VALUE=DATE:${dtEndFormatted}
  SUMMARY:${event.text}
  END:VEVENT
  `;
    })
    .join("");

  return icsHeader + icsEvents + icsFooter;
}

module.exports = createICS;
