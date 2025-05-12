import { Request, Response, NextFunction } from "express";
import * as crypto from "crypto";

/**
 * Middleware para validar los datos enviados por el ESP32.
 * @param req - Objeto de solicitud HTTP.
 * @param res - Objeto de respuesta HTTP.
 * @param next - Función para pasar al siguiente middleware.
 */
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
    const { tagId } = req.body;

    if (!tagId || typeof tagId !== "string" || tagId.length !== 10) {
        res.status(400).json({ error: "Datos inválidos. El tagId debe ser una cadena de 10 caracteres." });
        return;
    }

    next();
};

/**
 * Función para cifrar datos sensibles antes de almacenarlos.
 * @param data - Datos a cifrar.
 * @returns - Datos cifrados en formato hexadecimal.
 */
export const encryptData = (data: string): string => {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32); // Clave de 256 bits
    const iv = crypto.randomBytes(16); // Vector de inicialización

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Guardar clave e IV para descifrar (esto debe manejarse de forma segura en producción)
    console.log("Key:", key.toString("hex"));
    console.log("IV:", iv.toString("hex"));

    return encrypted;
};