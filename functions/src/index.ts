/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as v2 from 'firebase-functions/v2';
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
admin.initializeApp();
const db = admin.firestore();

type Indexable = {[key:string]: any};

//Esto nose que hace pero si la usas como URL/chair ó URL/chair funciona
export const miFuncionHttp = v2.https.onRequest((request, response)=>{
    const name = request.params[0].replace('/','');
    const items : Indexable = {lamp : 'this is a lam', chair: 'Good chair'};
    const message = items[name];
    response.send(`<h2> ${message}</h2>`);
});
//Saludo para verificar que todo funcione
export const hellworld = v2.https.onRequest((req, res) => {
    res.send("¡Hola desde Firebase! :v");
});
//Funcion para probar el manejo de JSON
//Se espera recibir un JSON y se envia de vuelta
export const echoJSON = functions.https.onRequest(async (req, res): Promise<any> => {
    try {
        if (req.method !== "POST") {
            return res.status(405).send({ error: "Método no permitido. Usa POST." });
        }

        const data = req.body;

        if (!data) {
            return res.status(400).send({ error: "No se recibió ningún JSON." });
        }

        return res.status(200).send({ mensaje: "JSON recibido correctamente", data });
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
});
//Registro de un empleado
//Se espera recibir un JSON con numero y nombre para subirlo en la coleccion Empleados
export const registrarEmpleado = functions.https.onRequest(async (req, res): Promise<any> => {
    try { 
        // Validar metodo POST
        if (req.method !== "POST") {
            return res.status(405).send("Método no permitido");
        }

        const { numero, nombre } = req.body;

        // Validar que se envíen los datos correctos
        if (!numero || !nombre) {
            return res.status(400).send("Faltan datos: numero y nombre son obligatorios.");
        }

        // Guardar en Firestore
        await db.collection("empleados").doc(numero.toString()).set({
            nombre: nombre,
            numero: numero,
            //timestamp es el momento en el que se registra creo
            timestamp: FieldValue.serverTimestamp()
        });
        return res.status(201).send(`Empleado ${nombre} registrado con éxito.`);
    } catch (error) {
        console.error("Error registrando empleado:", error);
        return res.status(500).send("Error interno del servidor.");
    }
});

//Solicitud de 5 empleados
//Devuelve un JSON con 5 empleados
export const obtenerEmpleados = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection("empleados").limit(5).get();
        const empleados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(empleados);
    } catch (error) {
        console.error("Error obteniendo empleados:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
