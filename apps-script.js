// GOOGLE APPS SCRIPT — paste this at script.google.com
// This receives RSVP form submissions and saves them to a Google Sheet.

const SHEET_NAME = 'RSVPs';

function doGet(e) {
  return handleRequest(e.parameter);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleRequest(data);
  } catch (err) {
    return handleRequest(e.parameter);
  }
}

function handleRequest(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Adults Attending']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name,
      data.email,
      data.adults
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
