const axios = require("axios");
const cheerio = require("cheerio");

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
      let startText,
        endText = ["", ""];

      startText = $(this).find(".start").text().replace(/\s+/g, "").trim();

      if (startText.length === 0) return;

      endText = $(this)
        .find(".end")
        .text()
        .replace(/\s+/g, "")
        .replace("-", "")
        .trim();

      if (endText.length === 0) endText = startText;

      const title = $(this).find(".more_link").text().trim();

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
