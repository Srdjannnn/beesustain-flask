from __future__ import annotations

import os
import re
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATABASE = Path(os.environ.get("BEESUSTAIN_DATABASE", BASE_DIR / "subscriptions.db"))

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024


def get_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    with get_db() as connection:
        connection.execute(
            """CREATE TABLE IF NOT EXISTS subscriptions (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   email TEXT NOT NULL COLLATE NOCASE UNIQUE,
                   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
               )"""
        )


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:filename>")
def site_files(filename: str):
    if filename not in {"script.js"}:
        return "Not found", 404
    return send_from_directory(BASE_DIR, filename)


@app.get("/css/<path:filename>")
def css_files(filename: str):
    allowed = {"osnova.css", "navigacija.css", "uvod.css", "proces.css", "tehnologija.css", "uticaj.css", "publika.css", "podnozje.css", "mali-ekrani.css"}
    if filename not in allowed:
        return "Not found", 404
    return send_from_directory(BASE_DIR / "css", filename)


@app.get("/assets/<path:filename>")
def asset_files(filename: str):
    return send_from_directory(BASE_DIR / "assets", filename)


@app.post("/api/subscribe")
def subscribe():
    data = request.get_json(silent=True) or request.form
    email = str(data.get("email", "")).strip().lower()
    if len(email) > 254 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify(ok=False, message="Unesite ispravnu email adresu."), 400

    try:
        with get_db() as connection:
            connection.execute("INSERT INTO subscriptions (email) VALUES (?)", (email,))
    except sqlite3.IntegrityError:
        pass

    return jsonify(ok=True, message="Hvala! Prijava je uspešno sačuvana.")


initialize_database()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=False)
