import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

// Extender la interfaz Request para incluir la propiedad user
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

/**
 * Middleware para verificar la autenticación de Firebase.
 * @param req - Objeto de solicitud HTTP.
 * @param res - Objeto de respuesta HTTP.
 * @param next - Función para pasar al siguiente middleware.
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No se proporcionó un token de autenticación." });
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verificando el token de autenticación:", error);
        res.status(403).json({ error: "Token de autenticación inválido." });
        return;
    }
};
