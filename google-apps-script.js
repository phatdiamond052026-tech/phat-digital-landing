const SPREADSHEET_ID = "1Zrf5OzklaYfnowVj_5OClXPwHgKJzFdkunafiJ-xmHY";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const body = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    body.submittedAt || new Date().toISOString(),
    body.name || "",
    body.phone || "",
    body.email || "",
    body.source || "phat-digital-landing",
    body.thankYouPage || "thank-you.html"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
