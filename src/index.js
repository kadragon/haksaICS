const parseCalendar = require("./parseCalendar");
const createICS = require("./createICS");

async function makeICSContents() {
  const nowYear = new Date().getFullYear();

  const data = await parseCalendar(nowYear);
  console.log(createICS(data));
}

makeICSContents();
