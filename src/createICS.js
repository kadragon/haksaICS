const crypto = require("crypto");

// 상수 분리
const HASH_ALGORITHM = "md5";

// 유틸리티 함수
const formatDate = (date) => date.replace(/[-:]/g, "").split(".")[0] + "Z";
const removeHyphens = (date) => date.replace(/-/g, "");
const formatShortDate = (date) =>
  date.toISOString().slice(5, 10).replace(/-/g, ".");

// UID 생성 함수
const createUid = (date, text) =>
  crypto.createHash(HASH_ALGORITHM).update(`${date}-${text}`).digest("hex");

// 현재 UTC 시간 가져오기
const getCurrentUTC = () => formatDate(new Date().toISOString());

// 이벤트 요약 포맷팅
const formatSummary = ({ title, startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const endFormatted = end > start ? ` (~${formatShortDate(end)})` : "";
  return `${title}${endFormatted}`;
};

// 이벤트를 ICS 형식으로 변환
const eventToICS = (event) => {
  const { startDate, title } = event;
  const uid = createUid(startDate, title);
  const dtstamp = getCurrentUTC();
  const dtStart = removeHyphens(startDate);
  const summary = formatSummary(event);
  const lastModified = getCurrentUTC();

  return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;VALUE=DATE:${dtStart}
SUMMARY:${summary}
LAST-MODIFIED:${lastModified}
END:VEVENT
`;
};

// ICS 헤더와 푸터
const ICS_HEADER = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Github@kadragon//haksaICS//KO
X-WR-CALNAME:한국교원대학교 학사/행사 일정
X-WR-TIMEZONE:Asia/Seoul
X-WR-CALDESC:https://github.com/kadragon/haksaICS
`;

const ICS_FOOTER = `END:VCALENDAR`;

// ICS 파일 생성
const createICS = (events) => {
  const icsEvents = events.map(eventToICS).join("");
  return `${ICS_HEADER}${icsEvents}${ICS_FOOTER}`;
};

module.exports = createICS;
