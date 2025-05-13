import { Request, Response, NextFunction } from "express";

const VALID_API_KEY = "my-secret-api-key-12345"; // Define tu clave secreta aquí o usa variables de entorno

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers["x-api-key"] as string; // La clave se envía en el encabezado "x-api-key"

    if (!apiKey || apiKey !== VALID_API_KEY) {
        res.status(403).json({ error: "Acceso denegado. API key inválida o no proporcionada." });
        return;
    }

    next(); // La clave es válida, continúa con la solicitud
};
