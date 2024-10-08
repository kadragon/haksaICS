const axios = require("axios");
const cheerio = require("cheerio");

const HOLIDAYS = [
  "개천절",
  "추석",
  "설날",
  "한글날",
  "성탄절",
  "신정",
  "어린이날",
  "부처님",
  "선거일",
  "광복절",
  "현충일",
  "근로자의",
];

/**
 * 날짜 텍스트를 파싱하여 ISO 형식의 날짜 문자열로 변환합니다.
 * @param {string} dateText - 날짜 텍스트 ('MM.DD' 형식).
 * @param {number} currentYear - 현재 연도.
 * @returns {string} ISO 형식의 날짜 문자열 ('YYYY-MM-DD').
 */
const parseDate = (dateText, currentYear) => {
  const [month, day] = dateText
    .match(/\d+/g)
    .map((num) => num.padStart(2, "0"));
  const year = Number(currentYear) + (month >= "03" ? 0 : 1);
  return `${year}-${month}-${day}`;
};

/**
 * 이벤트가 공휴일인지 확인합니다.
 * @param {string} title - 이벤트 제목.
 * @returns {boolean} 공휴일 여부.
 */
const isHoliday = (title) =>
  HOLIDAYS.some((holiday) => title.includes(holiday));

/**
 * 주어진 연도에 대한 학사 일정을 파싱합니다.
 * @param {number} currentYear - 파싱할 연도.
 * @returns {Promise<Array>} 학사 일정을 담은 객체 배열.
 */
async function parseCalendar(currentYear) {
  const url = `https://www.knue.ac.kr/www/selectSchdleWebList.do?key=542&searchY=${currentYear}&searchM=3`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const events = [];

    $("table.more_year tbody tr").each(function () {
      const title = $(this).find(".more_link").text().trim();

      if (title.includes("수업보강") || isHoliday(title)) return;

      const startText = $(this)
        .find(".start")
        .text()
        .replace(/\s+/g, "")
        .trim();
      if (!startText) return;

      let endText = $(this)
        .find(".end")
        .text()
        .replace(/\s+/g, "")
        .replace("-", "")
        .trim();
      if (!endText) endText = startText;

      const startDate = parseDate(startText, currentYear);
      const endDate = parseDate(endText, currentYear);

      events.push({ startDate, endDate, title });
    });

    return events;
  } catch (error) {
    console.error("학사 일정 파싱 중 오류 발생:", error);
    return [];
  }
}

module.exports = parseCalendar;
