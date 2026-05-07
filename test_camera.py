"""
Camera Testing Script
Tests the camera functionality through the Django API endpoints.
"""

import requests
import time
from urllib.request import urlopen
from PIL import Image
from io import BytesIO

BASE_URL = "http://localhost:8000"

def test_camera():
    print("🧪 Testing Camera API...\n")
    
    # Test 1: Start camera
    print("1️⃣ Starting camera...")
    try:
        response = requests.post(f"{BASE_URL}/start/")
        print(f"Response: {response.json()}\n")
    except Exception as e:
        print(f"❌ Error starting camera: {e}\n")
        return
    
    # Test 2: Check status
    print("2️⃣ Checking camera status...")
    time.sleep(1)
    try:
        response = requests.get(f"{BASE_URL}/status/")
        data = response.json()
        print(f"Status: {data}\n")
    except Exception as e:
        print(f"❌ Error getting status: {e}\n")
    
    # Test 3: Get video feed (first frame)
    print("3️⃣ Testing video feed...")
    try:
        response = requests.get(f"{BASE_URL}/video_feed/", stream=True)
        if response.status_code == 200:
            print("✅ Video feed is streaming\n")
        else:
            print(f"❌ Video feed error: {response.status_code}\n")
    except Exception as e:
        print(f"❌ Error accessing video feed: {e}\n")
    
    # Test 4: Let it run for a few seconds
    print("4️⃣ Running detection for 5 seconds...")
    time.sleep(5)
    
    # Test 5: Check status again
    print("5️⃣ Checking final status...")
    try:
        response = requests.get(f"{BASE_URL}/status/")
        data = response.json()
        print(f"Final Status: {data}\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    # Test 6: Stop camera
    print("6️⃣ Stopping camera...")
    try:
        response = requests.post(f"{BASE_URL}/stop/")
        print(f"Response: {response.json()}\n")
    except Exception as e:
        print(f"❌ Error stopping camera: {e}\n")
    
    print("✅ Camera test completed!")

if __name__ == "__main__":
    print("=" * 50)
    print("   FAKE INTERVIEW DETECTION API - CAMERA TEST")
    print("=" * 50)
    print()
    print("Make sure the Django server is running:")
    print("  python manage.py runserver\n")
    
    try:
        test_camera()
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
