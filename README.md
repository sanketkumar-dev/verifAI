# VerifAI

VerifAI is a Flask and SQLite app for checking text, links, documents, images, videos, and email. Login and signup use separate pages. Each account can see only its own verification history and reports.

## Run the app

1. Install the packages: `pip install -r requirements.txt`
2. Copy `.env.example` to `.env`, add your Gemini API key, and set `SECRET_KEY` to a long random value.
3. Start Flask: `python app.py`
4. Open `http://127.0.0.1:5000`. Visitors who are not logged in are sent to the login page.

## Accounts and private history

- Create an account at `/signup` with a name, email, and password, then log in at `/login`.
- Passwords are saved as Werkzeug password hashes, not plain text.
- New reports get their owner ID from the logged-in Flask session. History, report details, chat, and PDF downloads check that owner on the server.
- A report's QR link opens the private report after its owner logs in; it is not a public report link.
- The Text / Link tab can check pasted content and PDF, TXT, DOCX, JPG, JPEG, or PNG documents up to 10 MB. PDF and DOCX text is extracted before AI analysis; image documents use the existing Gemini image input and do not run OCR.

## Existing database files and migration

The active database is `verifai_users.db`. On startup, the app adds a `name` column to its existing `users` table when needed; existing emails, password hashes, and report rows are kept. Existing accounts can continue to log in with their current email and password; accounts created before this update have an empty name value.

Before first running the updated app, make a copy of `verifai_users.db` as a backup. The separate `verifai.db` file contains older reports without an owner ID and is not the active database. Those records are left untouched and are not imported or shown to accounts, because assigning them to a user would risk exposing private history.

## Test with two accounts

1. Sign up and log in as account A. Verify a text or image, then confirm its result appears under History.
2. Log out, sign up and log in as account B, and verify different content. Account B should see only its own verification.
3. While signed in as B, open a report URL or PDF URL copied from A. The server should return “not found” (404).
4. Log out and open `/` or `/api/history`. The dashboard redirects to login and the history API returns 401.
