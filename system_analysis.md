# System Analysis of the Project

## 1. High-Level Architecture

The project is a web application consisting of two main parts:

- **Backend:** A Flask-based REST API server implemented in Python.
- **Frontend:** A React-based single-page application (SPA) using React Router for navigation.

The backend handles user authentication, file upload/download with IPFS integration, and QR code generation. The frontend provides the user interface for interacting with these features.

---

## 2. Backend Components

- **app.py:** Main Flask application defining API endpoints for login, registration, file upload, download, logout, and authentication status. Uses Flask-Login for session management and Flask-CORS for cross-origin requests.

- **user_storage.py:** Manages user data storage in a SQLite database (`users.db`). Handles user creation, password hashing, and retrieval.

- **storage.py:** Handles file storage on IPFS with encryption and chunking. Manages uploading encrypted chunks, creating Merkle root hashes, pinning on IPFS, and downloading/reassembling files.

- **qr_generator.py:** Generates QR codes for IPFS content identifiers (CIDs).

- **db_inspect.py, fix_user_data.py, clear_users.py:** Utility scripts for database inspection, fixing user data, and clearing users.

---

## 3. Frontend Components

- **App.jsx:** Main React component managing routing and authentication state. Uses React Router DOM for page navigation and conditionally renders components based on authentication.

- **Pages:** Includes login, register, home, upload, download, contact, and about pages. Each page corresponds to a route and provides specific functionality.

- **Components:** Reusable UI components such as Navbar, IpfsDataFlow (visualizes IPFS data flow), IpfsDataReassembly (visualizes file reassembly), TitleWithIcon, and UI elements (Button, Input, Card, Progress, Spinner).

- **Styling:** Uses Tailwind CSS for utility-first styling, configured via `tailwind.config.js` and processed with PostCSS.

---

## 4. Data Flow

- **User Authentication:** Users register and login via API endpoints. Sessions are managed with Flask-Login and cookies.

- **File Upload:** Users upload files via the frontend. Files are encrypted, chunked, and uploaded to IPFS by the backend. A Merkle root hash (CID) is generated and pinned. A QR code for the CID is generated and returned.

- **File Download:** Users provide a CID to download files. The backend retrieves encrypted chunks from IPFS, decrypts, reassembles, and serves the file.

- **Visualizations:** Frontend components visualize the IPFS data flow and file reassembly process for user understanding.

---

## 5. Database Schema

- **Users Table:** Stores user credentials and metadata (id, password hash, failed login attempts, last attempt timestamp, TOTP secret).

- **File Metadata:** Stored as JSON files locally, containing encryption keys, chunk hashes, and filenames.

---

## 6. Security Considerations

- Passwords are hashed using Werkzeug security utilities.

- Account lockout after multiple failed login attempts.

- File encryption with AES-256 before IPFS upload.

- Session management with secure cookies.

---

## 7. Build and Deployment

- Frontend built with Vite, configured via `vite.config.js`.

- Styling with Tailwind CSS and PostCSS.

- Backend runs as a Flask server, serving API endpoints.

---

This analysis provides a comprehensive overview of the system architecture, components, data flow, and security aspects.

If you need further details or specific diagrams, please let me know.
