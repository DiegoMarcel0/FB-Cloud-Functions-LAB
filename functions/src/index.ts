/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as v2 from 'firebase-functions/v2';
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
admin.initializeApp();
const db = admin.firestore();

type Indexable = {[key:string]: any};

export const hellworld = v2.https.onRequest((request, response)=>{
    const name = request.params[0].replace('/','');
    const items : Indexable = {lamp : 'this is a lam', chair: 'Good chair'};
    const message = items[name];
    response.send(`<h2> ${message}</h2>`);
});

export const miFuncionHttp = v2.https.onRequest((req, res) => {
    res.send("¡Hola desde Firebase! :v");
});

export const registrarEmpleado = functions.https.onRequest(async (req, res): Promise<any> => {
    try { 
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
            timestamp: FieldValue.serverTimestamp()
            //timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.status(201).send(`Empleado ${nombre} registrado con éxito.`);
    } catch (error) {
        console.error("Error registrando empleado:", error);
        return res.status(500).send("Error interno del servidor.");
    }
});

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
