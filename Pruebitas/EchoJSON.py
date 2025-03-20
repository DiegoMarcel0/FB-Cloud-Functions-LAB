import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/echoJSON"
data = {"title": "foo","body": "bar","userId": 123}
headers = {"Content-Type": "application/json"}

response = re.post(url, json=data, headers=headers)
print(response.status_code, response.json())
