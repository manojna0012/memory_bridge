import sqlite3

DB_NAME = "memorybridge.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # USERS TABLE (for signup/login)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    """)

    # PEOPLE TABLE (for recognition database)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS people(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        relation TEXT
    )
    """)

    conn.commit()
    conn.close()