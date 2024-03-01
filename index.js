const parseCalendar = require("./parseCalendar");
const createICS = require("./createICS");
const fs = require("fs");

async function makeICSContents() {
  const data = await parseCalendar(2024);
  fs.writeFileSync("events.ics", createICS(data));
}

makeICSContents();
