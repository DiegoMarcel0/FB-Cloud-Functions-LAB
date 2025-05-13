#Llamada GET de las funcion "reads" 
#Se espera recibir en un json todas las lecturas de tarjetas con sus datos asociados
import requests as re

url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/api/reads"

response = re.get(url)
print(response.status_code,)
#print(response.json())
count=0
for item in response.json():
    print(item)
    count=count+1
print("Numero de elementos es: ", count)