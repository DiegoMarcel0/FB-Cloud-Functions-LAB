#Prueba basica de conexion, solo se esperar recibir un saludo
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/hellworld"

response = re.get(url)
print(response.status_code,)
print(response.text)
