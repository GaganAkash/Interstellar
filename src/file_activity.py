import sqlite3
import logging
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

file_activity_bp = Blueprint('file_activity', __name__)
DATABASE = 'users.db'

def init_file_activity_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS file_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            cid TEXT NOT NULL,
            qr_code TEXT NOT NULL,
            upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_file_activity_table()

def save_file_activity(user_id, cid, qr_code):
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO file_activity (user_id, cid, qr_code)
            VALUES (?, ?, ?)
        ''', (user_id, cid, qr_code))
        conn.commit()
        conn.close()
    except Exception as e:
        logging.error(f"Error saving file activity: {e}")

@file_activity_bp.route('/api/file-activity', methods=['GET'])
@login_required
def get_file_activity():
    try:
        user_id = current_user.id
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT cid, qr_code, upload_time FROM file_activity
            WHERE user_id = ?
            ORDER BY upload_time DESC
        ''', (user_id,))
        rows = cursor.fetchall()
        conn.close()

        activity = [{'cid': row[0], 'qr_code': row[1], 'upload_time': row[2]} for row in rows]
        return jsonify({'success': True, 'activity': activity})
    except Exception as e:
        logging.error(f"Exception fetching file activity: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
