import sqlite3

def fix_failed_attempts():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    # Find users with non-integer failed_attempts
    cursor.execute("SELECT id, failed_attempts FROM users")
    rows = cursor.fetchall()

    for user_id, failed_attempts in rows:
        try:
            int(failed_attempts)
        except (ValueError, TypeError):
            print(f"Fixing failed_attempts for user {user_id} from {failed_attempts} to 0")
            cursor.execute("UPDATE users SET failed_attempts = 0 WHERE id = ?", (user_id,))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_failed_attempts()
