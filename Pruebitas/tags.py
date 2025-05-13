#Llamado a la funcion tags con GET
#Se espera recibir en un json todas las tarjetas con datos asociados
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/api/tags"

response = re.get(url)
print(response.status_code,)
#print(response.json())
if(response.json()):
    for item in response.json():
        print(item)