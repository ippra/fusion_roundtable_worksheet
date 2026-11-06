# Collecting worksheet answers in a Google Sheet

The web worksheet's Submit button sends a group's answers to a Google Sheet
through a small Apps Script. Each worksheet gets one row; submitting again
replaces that row with the newer answers. Setup takes about five minutes.

1. Create a new Google Sheet, for example "Roundtable worksheet responses".
2. In the sheet, choose **Extensions > Apps Script**.
3. Delete the sample code, paste in all of `submit_to_sheet.gs`, and click
   **Save**.
4. Click **Deploy > New deployment**. Click the gear next to "Select type" and
   choose **Web app**. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then **Authorize access** and allow it. Google may warn
   that the app is unverified; choose **Advanced > Go to (project name)**.
   The script only touches this one sheet.
6. Copy the **Web app URL** (it ends in `/exec`).
7. In `fusion_roundtable_worksheet_web.html`, paste it between the quotes of
   `const SUBMIT_URL = "";` and save. The Submit button appears once that
   line is filled in.

The "Responses" tab and its header row are created on the first submission.

## Notes

- "Anyone" means anyone with the web app address can send it a row. The
  address is visible in the page source, so delete stray rows by hand if any
  appear, and turn the deployment off after the roundtable (**Deploy > Manage
  deployments > Archive**).
- If you edit the script later, publish the change with **Deploy > Manage
  deployments > Edit > Version: New version**. That keeps the same URL; a new
  deployment would get a different one.
- Answers still save in each browser as people type, so nothing is lost if a
  submission fails. Print and the Word file keep working as a fallback.
