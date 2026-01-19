@echo off
REM Script to start the FastAPI server

echo Installing dependencies...
pip install -r requirements.txt

echo Starting FastAPI server...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause