#Misma funcion que en POST, pero enviaremos 7 empleados para su registro
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/registrarEmpleado"
data = {"numero": 123, "nombre": "Juan Pérez"}
headers = {"Content-Type": "application/json"}
EMPLEADOS = [
  { "numero": 1, "nombre": "Juan Pérez" },
  { "numero": 2, "nombre": "María Gómez" },
  { "numero": 3, "nombre": "Carlos Ramírez" },
  { "numero": 4, "nombre": "Ana Torres" },
  { "numero": 5, "nombre": "Luis Fernández" },
  { "numero": 6, "nombre": "Sofía Herrera" },
  { "numero": 7, "nombre": "Pedro Sánchez" }
]

for emp in EMPLEADOS:
    #print(emp)
    print("Se enviara el siguiente JSON: ")
    print(emp)
    response = re.post(url, json=emp, headers=headers)
    print(response.status_code, response.text)