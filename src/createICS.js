const crypto = require("crypto");

const createUid = (date, text) =>
  crypto.createHash("md5").update(`${date}-${text}`).digest("hex");

const getCurrentUTC = () =>
  new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const formatDate = (date) => date.replace(/[-]/g, ""); // Hyphen removal is sufficient here

const formatSummary = (event) => {
  const { title, startDate, endDate } = event;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const endFormatted =
    end > start
      ? ` (~${end.toISOString().slice(5, 10).replace(/-/g, ".")})`
      : "";

  return `${title}${endFormatted}`;
};

const eventToICS = (event) => {
  const uid = createUid(event.startDate, event.title);
  const dtstamp = getCurrentUTC();
  const dtStart = formatDate(event.startDate);
  const summary = formatSummary(event);

  return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;VALUE=DATE:${dtStart}
SUMMARY:${summary}
END:VEVENT
`;
};

const createICS = (events) => {
  const icsHeader = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Github@kadragon//haksaICS//KO
X-WR-CALNAME:한국교원대학교 학사 일정
X-WR-TIMEZONE:Asia/Seoul
X-WR-CALDESC:https://github.com/kadragon/haksaICS
`;

  const icsFooter = `END:VCALENDAR`;

  const icsEvents = events.map(eventToICS).join("");

  return `${icsHeader}${icsEvents}${icsFooter}`;
};

module.exports = createICS;
