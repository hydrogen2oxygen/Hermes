#!/usr/bin/env python
"""
Helper script to build and serve the Angular application with FastAPI
"""

import os
import subprocess
import sys
import argparse


def build_angular_app():
    """Build the Angular application"""
    print("Building Angular application...")
    
    # Check if angular.json exists in ui directory
    if not os.path.exists("ui/angular.json"):
        print("Error: angular.json not found in ui directory.")
        print("Make sure you have an Angular project in the ui directory.")
        return False
    
    # Change to ui directory and run ng build
    original_dir = os.getcwd()
    os.chdir("ui")
    
    try:
        result = subprocess.run(["ng", "build", "--prod"], check=True)
        print("Angular application built successfully!")
        success = True
    except subprocess.CalledProcessError:
        print("Error building Angular application. Make sure Angular CLI is installed (npm install -g @angular/cli)")
        success = False
    except FileNotFoundError:
        print("Angular CLI not found. Please install it with: npm install -g @angular/cli")
        success = False
    
    os.chdir(original_dir)
    return success


def start_server():
    """Start the FastAPI server"""
    print("Starting FastAPI server...")
    
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except KeyboardInterrupt:
        print("\nServer stopped.")


def main():
    parser = argparse.ArgumentParser(description='Build and serve Angular app with FastAPI')
    parser.add_argument('--build-only', action='store_true', help='Only build the Angular app')
    parser.add_argument('--serve-only', action='store_true', help='Only start the server')
    
    args = parser.parse_args()
    
    if not args.serve_only:
        if not build_angular_app():
            print("Build failed. Exiting.")
            sys.exit(1)
    
    if not args.build_only:
        start_server()


if __name__ == "__main__":
    main()