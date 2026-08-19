const fs = require('fs');

let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');
code = code.replace(
  "let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];",
  "let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 29)).getValues()[0];"
);
code = code.replace(
  "let checkRows = sheet.getRange(1, 1, Math.min(lastRow, 5), sheet.getLastColumn()).getValues();",
  "let checkRows = sheet.getRange(1, 1, Math.min(lastRow, 5), Math.max(sheet.getLastColumn(), 29)).getValues();"
);

fs.writeFileSync('GoogleAppsScript.gs', code);
