/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
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

// Endpoint para manejar operaciones relacionadas con lecturas de RFID
export const reads = functions.https.onRequest(async (req, res): Promise<any> => {
    // Middleware para autenticar al usuario
    await authMiddleware(req, res, async () => {
        // Middleware para verificar si el usuario tiene rol de administrador
        await checkAdminRole(req, res, async () => {
            // Manejo de solicitudes GET para obtener datos de RFID
            if (req.method === "GET") {
                try {
                    const snapshot = await db.collection("RFIDTag").get();
                    res.status(200).json(snapshot.docs.map(doc => doc.data()));
                } catch (error) {
                    console.error("Error obteniendo datos:", error);
                    res.status(500).send("Error interno del servidor.");
                }
                return;
            }
            // Manejo de solicitudes POST para registrar nuevos tags RFID
            if (req.method !== "POST") {
                res.status(405).send("Método no permitido");
                return;
            }
            try {
                // Validación de entrada usando middleware
                await validateInput(req, res, async () => {
                    const { tagId } = req.body;
                    const existingTag = await db.collection("RFIDTag").where("tagId", "==", tagId).get();
                    if (existingTag.empty) {
                        await db.collection("RFIDTag").add({ tagId, approved: false });
                        res.status(201).send("Tag registrado correctamente.");
                    } else {
                        res.status(403).send("El tag ya existe.");
                    }
                });
            } catch (error) {
                console.error("Error registrando empleado:", error);
                res.status(500).send("Error interno del servidor.");
            }
        });
    });
});

// Endpoint para manejar operaciones relacionadas con la gestión de tags RFID
export const tags = functions.https.onRequest(async (req, res): Promise<any> => {
    // Middleware para autenticar al usuario
    await authMiddleware(req, res, async () => {
        // Middleware para verificar si el usuario tiene rol de administrador
        await checkAdminRole(req, res, async () => {
            // Manejo de solicitudes GET para obtener todos los tags RFID
            if (req.method === "GET") {
                try {
                    const snapshot = await db.collection("RFIDTag").get();
                    res.status(200).json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    console.error("Error obteniendo datos:", error);
                    res.status(500).send("Error interno del servidor.");
                }
                return;
            }
            // Manejo de solicitudes PUT para aprobar un tag RFID
            if (req.method !== "PUT") {
                res.status(405).send("Método no permitido");
                return;
            }
            const match = req.path.match(/^\/([^/]+)\/approve$/);
            if (!match) {
                res.status(400).send("Solicitud inválida");
                return;
            }
            const id = match[1];
            try {
                const tagRef = db.collection("RFIDTag").doc(id);
                const tagDoc = await tagRef.get();
                if (!tagDoc.exists) {
                    res.status(404).send("Tag no encontrado.");
                    return;
                }
                await tagRef.update({ approved: true });
                res.status(200).send("Tag aprobado correctamente.");
            } catch (error) {
                console.error("Error actualizando el estado del tag:", error);
                res.status(500).send("Error interno del servidor.");
            }
        });
    });
});

// Endpoint para registrar nuevos tags RFID con protección de apiKeyMiddleware
export const registerRFID = functions.https.onRequest(async (req, res): Promise<any> => {
    await apiKeyMiddleware(req, res, async () => {
        res.json({ message: "Acceso autorizado. Datos procesados correctamente." });
    });
});


