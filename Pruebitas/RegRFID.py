#Prueba de "reads" POST donde se enviara el Id del RFID y se registrara como nuevo y desaprovado
import requests

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/api/reads"
data = {"tagId": "12aea906-75d7-4d83-9e7a-0aa0894927f3"}
headers = {"Content-Type": "application/json",
           "x-api-key": "my-secret-api-key-12345"}

print("Se enviara el siguiente JSON: ")
print(data)
for n in range(10):
    response = requests.post(url, json=data, headers=headers)

    print(response.status_code, response.text)