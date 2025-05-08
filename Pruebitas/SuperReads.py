#Misma funcion que en reads, pero enviaremos 10 Id´s para su registro
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/reads"
headers = {"Content-Type": "application/json"}
RFIDS =  [
{
    "tagId": "26aea906-75d7-4d83-9e7a-0aa0894927d0"
  },
  {
    "tagId": "73460bcd-cc11-46de-9e43-79a5cde51443"
  },
  {
    "tagId": "84738ee6-c371-4330-82ff-6ee7c88228b8"
  },
  {
    "tagId": "be615963-10d3-44dd-9b0c-1c469a8e8f1c"
  },
  {
    "tagId": "9c8ccea1-7800-43d0-ba0b-3f12f6ec8058"
  },
  {
    "tagId": "6d4d7a54-5248-4604-9e9b-28948a7acf63"
  },
  {
    "tagId": "c09777e5-fdbb-4462-a6cd-16d348318d4f"
  },
  {
    "tagId": "1dd25e78-891d-4501-98f0-c36a5a80b05c"
  },
  {
    "tagId": "9e1153c9-f906-413a-965c-d968f7443951"
  },
  {
    "tagId": "4b9dc040-6a64-4c58-a404-63ae58ff6a3b"
  }
]

for tarjeta in RFIDS:
    #print(emp)
    print("Se enviara el siguiente JSON: ")
    print(tarjeta)
    response = re.post(url, json=tarjeta, headers=headers)
    print(response.status_code, response.text)