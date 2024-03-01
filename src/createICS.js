const crypto = require("crypto");

const createUID = (date, text) =>
  crypto.createHash("md5").update(`${date}-${text}`).digest("hex");

const getUTCDate = () =>
  new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const formatDate = (date) => date.replace(/-/g, "");

const formatSummary = (event) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  let summary = event.text;

  // 시작 날짜와 종료 날짜가 다를 경우, 종료 날짜를 요약에 추가
  if (endDate > startDate) {
    const endDateFormatted = endDate
      .toISOString()
      .slice(5, 10)
      .replace(/-/g, ".");
    summary += ` (~${endDateFormatted})`;
  }

  return summary;
};

const eventToICS = (event) => {
  const uid = createUID(event.startDate, event.text);
  const dtstamp = getUTCDate();
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
