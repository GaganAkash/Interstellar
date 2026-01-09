from flask import Flask, request, jsonify, send_file, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from storage import upload_to_ipfs, download_from_ipfs
from qr_generator import generate_qr_code
from user_storage import save_user, get_user
from file_activity import file_activity_bp, save_file_activity
import os
import mimetypes
import secrets
import logging
import traceback

app = Flask(__name__)

cors = CORS()

app = Flask(__name__)
cors.init_app(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "allow_headers": "*",
        "expose_headers": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})
login_manager = LoginManager()
login_manager.init_app(app)
app.secret_key = secrets.token_hex(16)

# Register blueprint for file activity API
app.register_blueprint(file_activity_bp)

class User(UserMixin):
    def __init__(self, username, password, failed_attempts=0, last_attempt=None):
        self.id = username
        self.password = password
        self.failed_attempts = failed_attempts
        self.last_attempt = last_attempt

    @staticmethod
    def get(user_id):
        user_data = get_user(user_id)
        if user_data:
            return User(
                username=user_data.id if hasattr(user_data, 'id') else user_data.username,
                password=user_data.password,
                failed_attempts=getattr(user_data, 'failed_attempts', 0),
                last_attempt=getattr(user_data, 'last_attempt', None)
            )
        return None

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def is_locked(self):
        if self.failed_attempts >= 5 and self.last_attempt:
            lockout_time = self.last_attempt + timedelta(minutes=30)
            return datetime.now() < lockout_time
        return False

    def record_failed_attempt(self):
        self.failed_attempts += 1
        self.last_attempt = datetime.now()

    def record_successful_login(self):
        self.failed_attempts = 0
        self.last_attempt = None

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        logging.info(f"Login attempt with data: {data}")
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.get(username)
        except Exception as e:
            logging.exception(f"Error fetching user {username}: {e}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500

        if not user:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

        if user.is_locked():
            return jsonify({'success': False, 'message': 'Account locked. Try again later'}), 403

        if not user.verify_password(password):
            user.record_failed_attempt()
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

        login_user(user)
        user.record_successful_login()
        return jsonify({'success': True, 'message': 'Login successful'})
    except Exception as e:
        import sys
        import traceback as tb
        exc_type, exc_value, exc_traceback = sys.exc_info()
        tb_str = ''.join(tb.format_exception(exc_type, exc_value, exc_traceback))
        logging.error(f"Exception during login: {tb_str}")
        print(f"Exception during login: {tb_str}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

import logging

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if password != confirm_password:
        logging.warning(f"Registration failed for user {username}: Passwords do not match")
        return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

    try:
        save_user(username, password)
        logging.info(f"User registered successfully: {username}")
        return jsonify({'success': True, 'message': 'Registration successful'})
    except ValueError as e:
        logging.warning(f"Registration failed for user {username}: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/api/upload', methods=['POST'])
@login_required
def upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file selected'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'Empty filename'}), 400

    try:
        user_id = current_user.id
        cid, chunk_hashes = upload_to_ipfs(file, user_id)
        qr_code = generate_qr_code(cid)

        # Save file activity record without tampering original code
        save_file_activity(user_id, cid, qr_code)

        return jsonify({'success': True, 'cid': cid, 'qr_code': qr_code})
    except Exception as e:
        import sys
        import traceback as tb
        exc_type, exc_value, exc_traceback = sys.exc_info()
        tb_str = ''.join(tb.format_exception(exc_type, exc_value, exc_traceback))
        logging.error(f"Exception during upload: {tb_str}")
        print(f"Exception during upload: {tb_str}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/download', methods=['POST'])
@login_required
def download():
    data = request.json
    cid = data.get('cid')
    if not cid:
        return jsonify({'success': False, 'message': 'CID required'}), 400

    try:
        result = download_from_ipfs(cid)
        if result is None:
            return jsonify({'success': False, 'message': 'File not found'}), 404
        file_path, _ = result
        if not file_path or not os.path.exists(file_path):
            return jsonify({'success': False, 'message': 'File not found'}), 404

        filename = os.path.basename(file_path)
        mimetype, _ = mimetypes.guess_type(filename)
        if mimetype is None:
            mimetype = 'application/octet-stream'

        response = send_file(file_path, as_attachment=True, download_name=filename, mimetype=mimetype)
        response.headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
    except Exception as e:
        import sys
        import traceback as tb
        exc_type, exc_value, exc_traceback = sys.exc_info()
        tb_str = ''.join(tb.format_exception(exc_type, exc_value, exc_traceback))
        logging.error(f"Exception during download: {tb_str}")
        print(f"Exception during download: {tb_str}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out'})

@app.route('/api/auth-status', methods=['GET'])
def auth_status():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'username': current_user.id})
    else:
        return jsonify({'authenticated': False})

if __name__ == '__main__':
    app.run(debug=True)
