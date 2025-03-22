#Prueba usar la funcion de registro para actualizar un campo ya existente
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/registrarEmpleado"
data = {"numero": "123", "nombre": "Ola que hace"}
headers = {"Content-Type": "application/json"}

print("Se enviara el siguiente JSON: ")
print(data)
response = re.post(url, json=data, headers=headers)

print(response.status_code, response.text)