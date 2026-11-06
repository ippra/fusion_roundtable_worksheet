/**
 * Receives worksheet submissions from fusion_roundtable_worksheet_web.html
 * and writes one row per worksheet to the "Responses" tab of the Google
 * Sheet this script is attached to. A resubmission carries the same
 * worksheet id and replaces its row, so the sheet holds each group's latest
 * answers. Setup steps are in google_sheet_setup.md.
 */
const TAB = "Responses";
const HEADER = [
  "Submitted", "Worksheet ID", "Group", "Question no.", "Question",
  "1. Preliminary Answer", "2. Evidence and Reasoning",
  "3. Confidence and Qualifications", "4. Uncertainties and Disagreements",
  "5. Areas for Further Work", "Times submitted"
];
const MAX_CHARS = 20000; // per answer; a sheet cell holds at most 50,000

// Text starting with = + - or @ would be read as a formula; a leading
// apostrophe keeps it as plain text
function clean(value) {
  const s = String(value == null ? "" : value).slice(0, MAX_CHARS);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const id = String(d.id || "");
    if (!/^[\w-]{8,64}$/.test(id)) return reply({ok: false, error: "bad id"});

    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(TAB) || book.insertSheet(TAB);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADER.length).setFontWeight("bold");
    }

    const n = sheet.getLastRow() - 1;
    const ids = n > 0 ? sheet.getRange(2, 2, n, 1).getValues().flat() : [];
    const at = ids.indexOf(id);
    const times = at >= 0 ? Number(sheet.getRange(at + 2, 11).getValue()) + 1 : 1;

    const row = [
      new Date(), id, clean(d.group), clean(d.qno), clean(d.question),
      clean(d.s1), clean(d.s2), clean(d.s3), clean(d.s4), clean(d.s5), times
    ];
    if (at >= 0) {
      sheet.getRange(at + 2, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    return reply({ok: true});
  } catch (err) {
    return reply({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}
