import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# Database setup
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            password TEXT NOT NULL
        )
    ''')
    
    # Check and add missing columns
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'failed_attempts' not in columns:
        cursor.execute('ALTER TABLE users ADD COLUMN failed_attempts INTEGER DEFAULT 0')
    if 'last_attempt' not in columns:
        cursor.execute('ALTER TABLE users ADD COLUMN last_attempt TEXT')
    if 'totp_secret' not in columns:
        cursor.execute('ALTER TABLE users ADD COLUMN totp_secret TEXT')
    
    conn.commit()
    conn.close()
    print("Database schema verified and updated")

def save_user(username, password, failed_attempts=0, last_attempt=None, totp_secret=None):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE id = ?', (username,))
    if cursor.fetchone() is not None:
        conn.close()
        raise ValueError("User already exists.")
    cursor.execute('''
        INSERT INTO users (id, password, failed_attempts, last_attempt, totp_secret)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, generate_password_hash(password), failed_attempts, last_attempt, totp_secret))
    conn.commit()
    conn.close()

class User:
    def __init__(self, username, password, failed_attempts=0, last_attempt=None, totp_secret=None):
        self.id = username
        self.password = password
        self.failed_attempts = failed_attempts
        self.last_attempt = last_attempt
        self.totp_secret = totp_secret

    def verify_password(self, password):
        return check_password_hash(self.password, password)

def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Get all available columns
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    # Build query based on available columns
    select_columns = ['id', 'password']
    if 'failed_attempts' in columns:
        select_columns.append('failed_attempts')
    if 'last_attempt' in columns:
        select_columns.append('last_attempt')
        
    query = f'SELECT {", ".join(select_columns)} FROM users WHERE id = ?'
    cursor.execute(query, (username,))
    user_data = cursor.fetchone()
    conn.close()
    
    # Debug prints
    print(f"Columns: {columns}")
    print(f"User data: {user_data}")
    
    if user_data:
        # Map column names to indices
        col_index = {col: idx for idx, col in enumerate(select_columns)}
        return User(
            username=user_data[col_index['id']],
            password=user_data[col_index['password']],
            failed_attempts=int(user_data[col_index['failed_attempts']]) if 'failed_attempts' in col_index and user_data[col_index['failed_attempts']] is not None else 0,
            last_attempt=datetime.datetime.fromisoformat(user_data[col_index['last_attempt']]) if 'last_attempt' in col_index and user_data[col_index['last_attempt']] else None
        )
    return None
# Initialize the database
init_db()

# Create default admin user if not exists
def create_default_admin():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE id = ?', ('Admin',))
    if cursor.fetchone() is None:
        from werkzeug.security import generate_password_hash
        hashed_password = generate_password_hash('admin')
        cursor.execute('INSERT INTO users (id, password, failed_attempts, last_attempt, totp_secret) VALUES (?, ?, ?, ?, ?)', ('Admin', hashed_password, 0, None, None))
        conn.commit()
        print("Default admin user created with username 'Admin' and password 'admin'")
    conn.close()

create_default_admin()
