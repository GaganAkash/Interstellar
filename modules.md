# Project Modules

## Backend (src/ directory)
- **app.py**: Main Flask application with API endpoints and user authentication.
- **user_storage.py**: User database management and authentication utilities.
- **storage.py**: IPFS file storage with encryption, chunking, and retrieval.
- **db_inspect.py**: Database inspection utilities.
- **fix_user_data.py**: Utilities for fixing user data.
- **clear_users.py**: Utilities for clearing user data.
- **qr_generator.py**: QR code generation for IPFS CIDs.
- **requirements.txt**: Python dependencies.

## Frontend (frontend_pages/src/ directory)
- **App.jsx**: Main React application with routing and authentication state.
- **components/**: React components including:
  - Navbar.jsx: Navigation bar component.
  - IpfsDataFlow.jsx: Visualization of IPFS data flow steps.
  - IpfsDataReassembly.jsx: Visualization of IPFS data reassembly.
  - TitleWithIcon.jsx: Title component with icon.
  - ui/: UI components like Button.jsx, Input.jsx, Card.jsx, Progress.jsx, Spinner.jsx.
- **pages/**: React pages including login.jsx, register.jsx, home.jsx, upload.jsx, download.jsx, contact.jsx, about.jsx.
- **assets/**: Static assets like images and icons.
- **index.css, App.css**: Global styles.
- **tailwind.config.js, postcss.config.cjs, vite.config.js**: Build and styling configurations.
- **package.json, package-lock.json**: Node.js dependencies and lock files.

## Other
- **users.db**: SQLite database for user data.
- **downloads/**: Directory for downloaded files and metadata JSON files.

This markdown file summarizes the main modules and their roles in the project.
