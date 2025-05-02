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

export const registrarRFID = functions.https.onRequest(async (req, res): Promise<any> => {
    if (req.method !== "POST") {
        return res.status(405).send("Método no permitido");
    }
    try { 
        // Validar metodo POST
        
        const { tagId } = req.body;
        // Validar que se envíen los datos correctos
        if (!tagId) {
            return res.status(400).send("Faltan datos: tagID son obligatorios.");
        }
        //Validar si El tagID ya está registrado.
        const existingTag = await db.collection("RFIDTag")
            .where("tagId", "==", tagId)
            .get();
       // Guardar NUEVO RFID en Firestore
        if (existingTag.empty) {
            const newRFIDRef = await db.collection("RFIDTag").add({
                userId: "nombre",
                tagId: tagId,
                new: true,
                approved: false,
            });
    
            await newRFIDRef.collection("Read").add({
                createdAt: FieldValue.serverTimestamp()
            });
            return res.status(403).send("Empaquetado y enviado");
        }
        //Guardar Registro en READ
        const readData = existingTag.docs[0].data().approved;
        existingTag.docs[0].ref.collection("Read").add({
            createdAt: FieldValue.serverTimestamp()
        });
        if(readData){
            return res.status(200).send("El tagID ya está registrado y aprobado.");
        }
        //No Guardar Registro en READ
        return res.status(403).send("Ya existia sin aprobar");
    } catch (error) {
        console.error("Error registrando empleado:", error);
        return res.status(500).send("Error interno del servidor.");
    }
});

export const reads = functions.https.onRequest(async (req, res): Promise<any> => {
    if (req.method !== "GET") {
        return res.status(405).send("Método no permitido");
    }
    try {
        //get method
        
        const snapshot = await db.collection("RFIDTag").get();
        let tags = [];

        for (const doc of snapshot.docs) {
            const readSnapshot = await doc.ref.collection("Read").get();
            for (const docu of readSnapshot.docs) {
                tags.push({
                    id: doc.id,
                    userId: doc.data().userId,
                    tagId: doc.data().tagId,
                    createdAt: docu.data().createdAt,
                });
            }
        }
        return res.status(200).json(tags);
    } catch (error) {
        console.error("Error obteniendo lecturas:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

export const tags = functions.https.onRequest(async (req, res) => {
    if (req.method !== "GET") {
        res.status(405).send("Método no permitido");
    }
    let tags = [];
    try {
        const snapshot = await db.collection("RFIDTag").get();
        for (const doc of snapshot.docs) {
            tags.push({
                id: doc.id,
                userId: doc.data().userId,
                approved: doc.data().approved,
                new: doc.data().new,
                tagId: doc.data().tagId
            });
        }
        res.status(200).json(tags);
    } catch (error) {
        console.error("Error obteniendo lecturas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export const approveRFIDTag = functions.https.onRequest(async (req, res): Promise<any> => {
    if (req.method !== "PUT") {
        return res.status(405).send("Método no permitido");
    }

    const match = req.path.match(/^\/([^/]+)\/approve$/);
    if (!match) {
        return res.status(400).json({ error: "URL no válida. "+req.path });
    }

    const id = match[1];
    

    try {
        const tagRef = db.collection("RFIDTag").doc(id);
        const tagDoc = await tagRef.get();

        if (!tagDoc.exists) {
             res.status(404).json({ error: "El documento RFIDTag no existe." });
        }

        await tagRef.update({ approved: true });
        return res.status(200).json({ message: "RFIDTag aprobado exitosamente." });
    } catch (error) {
        console.error("Error obteniendo lecturas:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

