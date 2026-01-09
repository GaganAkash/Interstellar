import sqlite3

def inspect_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    # Get table schema
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("Table schema:")
    for col in columns:
        print(col)

    # Get all rows
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    print("\\nAll rows in users table:")
    for row in rows:
        print(row)

    conn.close()

if __name__ == "__main__":
    inspect_db()
