import requests 
##
#Funcion de ejemplo donde se llama la funcion de tags de la forma "URL.../tags/:id/approve"
#Donde id es la ID de documento en Firebase y cambia su campo de "approve" a TRUE
#
#NOTA: la id es generada por firebase y esta id es sacada de lecturas con otras funciones
url = "http://127.0.0.1:5001/rfid-backend-7d6b3/us-central1/tags/"
#data = "00000000000000000000" #No existe
data = "8hgkOwjSzKl3v23t6KfU/approve"
headers = {"Content-Type": "application/json"}

print("Se enviara el siguiente URL: ")
print(url)
response = requests.put(url+data)

print(response.status_code, response.text)
