from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Angular Dist Server", description="FastAPI server for Angular dist files")

# Check if the dist directory exists, if not create a placeholder
dist_path = os.path.join(os.getcwd(), "ui", "dist", "ui")

# Serve static files from the Angular dist folder
if os.path.exists(dist_path):
    app.mount("/static", StaticFiles(directory=dist_path), name="static")
else:
    # Create a temporary directory structure for demonstration
    os.makedirs(dist_path, exist_ok=True)
    # Create a placeholder index.html
    placeholder_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Placeholder</title>
</head>
<body>
    <h1>Angular App Placeholder</h1>
    <p>This is a placeholder. Please build your Angular app with 'ng build' to populate the dist folder.</p>
</body>
</html>"""
    with open(os.path.join(dist_path, "index.html"), "w") as f:
        f.write(placeholder_html)

@app.get("/")
async def serve_spa():
    """Serve the main Angular application"""
    index_path = os.path.join(dist_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    else:
        raise HTTPException(status_code=404, detail="Angular app not found. Please build the Angular app first.")

@app.get("/{full_path:path}")
async def serve_static(full_path: str):
    """Serve other static files or fallback to index.html for SPA routing"""
    file_path = os.path.join(dist_path, full_path)
    
    # If the file exists, serve it
    if os.path.exists(file_path):
        return FileResponse(file_path)
    
    # Otherwise, serve index.html for SPA routing
    index_path = os.path.join(dist_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)