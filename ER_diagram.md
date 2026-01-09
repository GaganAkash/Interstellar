# Entity-Relationship Diagram (ER Diagram) for the Project

```mermaid
erDiagram
    USERS {
        TEXT id PK "Primary Key - Username"
        TEXT password "Hashed password"
        INTEGER failed_attempts "Number of failed login attempts"
        TEXT last_attempt "Timestamp of last login attempt"
        TEXT totp_secret "TOTP secret for 2FA"
    }

    FILE_METADATA {
        TEXT merkle_root_hash PK "Root hash of file in IPFS"
        TEXT key "Encryption key (hex)"
        TEXT[] chunks "List of encrypted chunk hashes"
        TEXT filename "Original filename"
    }

    USERS ||--o{ FILE_METADATA : "uploads"
```

Notes:
- The USERS table is stored in the SQLite database `users.db`.
- FILE_METADATA is stored as JSON files in the downloads directory, not in the database.
- The relationship indicates that a user can upload multiple files (file metadata).
- File chunks are stored in IPFS with encryption and chunking handled by the backend.

This ER diagram summarizes the main data entities and their relationships in the project.
