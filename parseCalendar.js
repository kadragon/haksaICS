const axios = require("axios");
const cheerio = require("cheerio");

const parseDate = (dateText, currentYear) => {
  let [month, day] = dateText.match(/\d+/g);
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");
  return `${Number(currentYear) + (month >= "03" ? 0 : 1)}-${month}-${day}`;
};

async function parseCalendar(currentYear) {
  const timestamp = new Date(`${currentYear}-03-01`).getTime() / 1000;
  const url = `https://knue.ac.kr/icons/app/knue/schedule/schedule.php?w_date=${timestamp}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const events = [];

    $("table.sch3 tr").each(function () {
      const dateText = $(this).find(".knue_date").text().trim();
      if (dateText.length === 0) return;

      let startDate, endDate;

      if (dateText.includes("~")) {
        const dates = dateText.split("~");
        startDate = parseDate(dates[0], currentYear);
        endDate = dates[1].includes(".")
          ? parseDate(dates[1], currentYear)
          : parseDate(`${startDate.split("-")[1]}-${dates[1]}`, currentYear);
      } else {
        startDate = endDate = parseDate(dateText, currentYear);
      }

      const text = $(this)
        .find("td.con1 a")
        .text()
        .trim()
        .replace(dateText, "")
        .trim(); // Removes the date part from the text

      events.push({
        startDate,
        endDate,
        text,
      });
    });

    return events;
  } catch (error) {
    console.error(error);
  }
}

module.exports = parseCalendar;
