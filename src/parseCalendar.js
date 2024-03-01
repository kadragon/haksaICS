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
  const timestamp = new Date(`${currentYear}-03-01`).getTime() / 1000;
  const url = `https://knue.ac.kr/icons/app/knue/schedule/schedule.php?w_date=${timestamp}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const events = [];

    $("table.sch3 tr").each(function () {
      const dateText = $(this).find(".knue_date").text().trim();
      if (dateText.length === 0) return;

      const [startDateText, endDateText] = dateText.includes("~")
        ? dateText.split("~")
        : [dateText, dateText];

      const startDate = parseDate(startDateText, currentYear);
      const endDate = endDateText.includes(".")
        ? parseDate(endDateText, currentYear)
        : parseDate(`${startDate.split("-")[1]}-${endDateText}`, currentYear);

      const text = $(this)
        .find("td.con1 a")
        .text()
        .trim()
        .replace(dateText, "")
        .trim();

      events.push({ startDate, endDate, text });
    });

    return events;
  } catch (error) {
    console.error("학사 일정 파싱 중 오류 발생:", error);
    return [];
  }
}

module.exports = parseCalendar;
