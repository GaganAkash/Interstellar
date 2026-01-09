# System Design of the Project

## Overview

The project is a web application designed to provide secure file storage and sharing using IPFS (InterPlanetary File System) with encryption and chunking. It consists of a backend API server and a frontend React application.

---

## Architecture

- **Backend:** Flask-based REST API server handling user authentication, file upload/download, encryption, and IPFS integration.
- **Frontend:** React SPA with routing, authentication state management, and UI components for file operations and visualizations.

---

## Components

### Backend

- **Authentication Module:** Manages user registration, login, session management, and account security (lockout, password hashing).
- **Storage Module:** Handles file encryption, chunking, uploading to IPFS, metadata management, and file download with decryption and reassembly.
- **QR Code Module:** Generates QR codes for IPFS content identifiers.
- **Database:** SQLite database storing user credentials and metadata.

### Frontend

- **Routing:** React Router DOM manages navigation between pages.
- **Authentication State:** Maintains user login status and protects routes.
- **Pages:** Login, Register, Home, Upload, Download, Contact, About.
- **Components:** Navbar, IPFS data flow visualizations, UI elements.
- **Styling:** Tailwind CSS for responsive and utility-first design.

---

## Data Flow

1. **User Authentication:** Users register and login via API; sessions maintained with secure cookies.
2. **File Upload:** Files encrypted and chunked on backend, uploaded to IPFS; metadata saved; QR code generated.
3. **File Download:** Files retrieved from IPFS, decrypted, reassembled, and served to users.
4. **Visualizations:** Frontend components display IPFS data flow and file reassembly processes.

---

## Security

- Password hashing with Werkzeug.
- Account lockout after multiple failed attempts.
- AES-256 encryption for file chunks.
- Secure session management.

---

## Deployment

- Frontend built with Vite.
- Backend runs Flask server.
- CORS configured for frontend-backend communication.

---

This design ensures secure, scalable, and user-friendly file storage leveraging decentralized IPFS technology.

If you need detailed diagrams or further elaboration, please let me know.
