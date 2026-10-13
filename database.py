# DATABASE: users aur reports save/padhne ka kaam (SQLite, kuch install nahi karna)
import os, json, sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "verifai_users.db")


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row      # taaki row["email"] jaise naam se value mile
    return conn


def create_tables():
    with connect() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT '',
            email TEXT UNIQUE,
            password_hash TEXT
        )""")
        conn.execute("""CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY, user_id INTEGER, kind TEXT, content TEXT,
            result TEXT, confidence INTEGER, reason TEXT, details TEXT, sources TEXT, created TEXT)""")
        user_columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
        if "name" not in user_columns:
            conn.execute("ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''")


# ----- Users -----
def add_user(name, email, password_hash):
    with connect() as conn:
        conn.execute("INSERT INTO users(name, email, password_hash) VALUES(?, ?, ?)",
                     (name, email, password_hash))


def find_user(email):
    with connect() as conn:
        return conn.execute("SELECT * FROM users WHERE email=? COLLATE NOCASE", (email,)).fetchone()


def find_user_by_id(user_id):
    with connect() as conn:
        return conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()


# ----- Reports -----
def row_to_dict(row):
    report = dict(row)
    report["sources"] = json.loads(report["sources"])   # text se wapas list
    return report


def save_report(r):
    with connect() as conn:
        conn.execute("INSERT INTO reports VALUES(?,?,?,?,?,?,?,?,?,?)",
                     (r["id"], r["user_id"], r["kind"], r["content"], r["result"], r["confidence"],
                      r["reason"], r["details"], json.dumps(r["sources"]), r["created"]))


def find_report(report_id, user_id):
    with connect() as conn:
        row = conn.execute("SELECT * FROM reports WHERE id=? AND user_id=?", (report_id, user_id)).fetchone()
    return row_to_dict(row) if row else None


def find_public_report(report_id):
    """QR/link ke liye: report ID se mil jaati hai (login ki zaroorat nahi)."""
    with connect() as conn:
        row = conn.execute("SELECT * FROM reports WHERE id=?", (report_id,)).fetchone()
    return row_to_dict(row) if row else None


def history_of(user_id):
    """Sirf us user ki reports."""
    with connect() as conn:
        rows = conn.execute("SELECT * FROM reports WHERE user_id=? ORDER BY rowid DESC LIMIT 30", (user_id,)).fetchall()
    return [row_to_dict(r) for r in rows]
