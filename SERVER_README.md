# FastAPI Angular Server

This project serves an Angular application using FastAPI.

## Setup Instructions

1. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

2. Build your Angular application:
   ```bash
   cd ui
   ng build --prod
   ```
   
   This will create the `ui/dist/ui` directory with your compiled Angular app.

3. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   Or run the batch file (on Windows):
   ```bash
   start_server.bat
   ```

## Features

- Serves static files from `ui/dist/ui`
- Single Page Application (SPA) routing support
- Fallback to index.html for client-side routing
- Automatic reloading during development

## Accessing the Application

Once the server is running, you can access your Angular application at:
- http://localhost:8000

The server will be accessible from other devices on the same network at:
- http://YOUR_IP_ADDRESS:8000