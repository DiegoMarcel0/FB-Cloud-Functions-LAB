#Solicitud ejemplo, se espera un JSON con 5 empleados de la coleccion empleados
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/obtenerEmpleados"

response = re.get(url)
print(response.status_code,)
print(response.json())

for item in response.json():
    print(f"Nombre: {item['nombre']}, Numero: {item['numero']}")
