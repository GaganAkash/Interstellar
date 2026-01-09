import sqlite3

def clear_users():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    # Delete all users except default admin
    cursor.execute("DELETE FROM users WHERE id != 'Admin'")
    conn.commit()
    conn.close()
    print("All users except 'Admin' have been deleted.")

if __name__ == "__main__":
    clear_users()
