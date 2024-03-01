const crypto = require("crypto");

function createUID(date, text) {
  // Simple hash of date and text to generate a UID
  return crypto.createHash("md5").update(`${date}-${text}`).digest("hex");
}

function getUTCDate(startDate) {
  const now = new Date(startDate);
  return now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function createICS(events) {
  const icsHeader = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KNUE//KO
NAME:KNUE Academic Calendar
CALSCALE:GREGORIAN
`;

  const icsFooter = `END:VCALENDAR`;

  const icsEvents = events
    .map((event) => {
      const uid = createUID(event.startDate, event.text);
      const dtstamp = getUTCDate(event.startDate);
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
UID:${uid}
DTSTAMP:${dtstamp}
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
