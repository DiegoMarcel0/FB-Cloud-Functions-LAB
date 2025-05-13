/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { authMiddleware } from "./Seguridad/authMiddleware";
import { validateInput } from "./Seguridad/validateInput";
import { apiKeyMiddleware } from "./Seguridad/apiKeyMiddleware";
import { Request, Response, NextFunction } from "express";

// Middleware para verificar roles específicos
const checkAdminRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
        return;
    }
    next();
};

admin.initializeApp();
const db = admin.firestore();

const express = require("express");
const app = express();

// Endpoint "reads" para manejar operaciones relacionadas con lecturas de RFID
// Manejo de solicitudes GET para obtener datos de RFID
app.get("/reads", async (req:any, res:any) => {
    // Middleware para autenticar al usuario
    await authMiddleware(req, res, async () => {
        // Middleware para verificar si el usuario tiene rol de administrador
        await checkAdminRole(req, res, async () => {
            try {
                const snapshot = await db.collection("RFIDTag").get();
                let tagsReaded = [];
                for (const doc of snapshot.docs) {
                    const readSnapshot = await doc.ref.collection("Read").get();
                    for (const docu of readSnapshot.docs) {
                        tagsReaded.push({
                            id: doc.id,
                            userId: doc.data().userId,
                            tagId: doc.data().tagId,
                            createdAt: docu.data().createdAt,
                        });
                    }
                }
                return res.status(200).json(tagsReaded);
            } catch (error) {
                console.error("Error obteniendo lecturas:", error);
                return res.status(500).json({ error: "Error interno del servidor" });
            } 
        });
    });
});

// Manejo de solicitudes POST para registrar nuevos tags RFID
app.post("/reads", async (req:any, res:any) => {
    // Middleware para autenticar al dispositivo
    await apiKeyMiddleware(req, res, async () => {
        try {
            // Validación de entrada usando middleware
            await validateInput(req, res, async () => {
                const { tagId } = req.body;
                //Verificar si es una nueva targeta 
                const existingTag = await db.collection("RFIDTag").where("tagId", "==", tagId).get();
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
                existingTag.docs[0].ref.collection("Read").add({
                    createdAt: FieldValue.serverTimestamp()
                });
                //Determinar estatus segun si esta aprobada
                const readData = existingTag.docs[0].data().approved;
                if(readData){
                        res.status(200).send("El tagID ya está registrado y aprobado.");
                }else{
                    res.status(403).send("Ya existia sin aprobar");
                }
                     
            });
        } catch (error) {
            console.error("Error registrando empleado:", error);
            res.status(500).send("Error interno del servidor.");
        }
    });
});

// Endpoint "tags" para manejar operaciones relacionadas con la gestión de tags RFID
// Manejo de solicitudes GET para obtener todos los tags RFID
app.get("/tags", async (req:any, res:any) => {
    // Middleware para autenticar al usuario
    await authMiddleware(req, res, async () => {
        // Middleware para verificar si el usuario tiene rol de administrador
        await checkAdminRole(req, res, async () => {
            try {
                const snapshot = await db.collection("RFIDTag").get();
                res.status(200).json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error obteniendo datos:", error);
                res.status(500).send("Error interno del servidor.");
            }
            return;
        });
    });
});

 // Manejo de solicitudes PUT para aprobar un tag RFID
app.put("/tags/:tagId/approve", async (req:any, res:any) => {
    //Validacion de parametros
    // Middleware para autenticar al usuario
    await authMiddleware(req, res, async () => {
        // Middleware para verificar si el usuario tiene rol de administrador
        await checkAdminRole(req, res, async () => {
            const tagId = req.params.tagId;
            if (!tagId) {
                res.status(400).send("Solicitud inválida. tagId faltante.");
                return;
            }
            try {
                //Verificacion de ID de documento
                const tagRef = db.collection("RFIDTag").doc(tagId);
                const tagDoc = await tagRef.get();
                if (!tagDoc.exists) {
                    res.status(404).send("Tag no encontrado.");
                    return;
                }
                //Actualizacion de approve a TRUE
                await tagRef.update({ approved: true });
                res.status(200).send("Tag aprobado correctamente.");
            } catch (error) {
                console.error("Error actualizando el estado del tag:", error);
                res.status(500).send("Error interno del servidor.");
            }
        });
    });
});
export const api = functions.https.onRequest(app);


