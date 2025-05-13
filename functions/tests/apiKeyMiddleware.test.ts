import { apiKeyMiddleware } from "../src/Seguridad/apiKeyMiddleware";
import { Request, Response, NextFunction } from "express";

describe("apiKeyMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { headers: {} as Record<string, string> }; // Define headers as a non-optional property
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    // Add a fallback to ensure req.headers is defined before accessing it
    const ensureHeaders = (req: Partial<Request>) => {
        if (!req.headers) {
            req.headers = {};
        }
    };

    it("debería permitir el acceso con una clave válida", () => {
        ensureHeaders(req);
        req.headers = req.headers || {};
        req.headers["x-api-key"] = "my-secret-api-key-12345";

        apiKeyMiddleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled(); // Verifica que se llamó a next()
        expect(res.status).not.toHaveBeenCalled(); // No debería haber errores
    });

    it("debería devolver 403 si la clave es inválida", () => {
        ensureHeaders(req);
        req.headers = req.headers || {};
        req.headers["x-api-key"] = "invalid-key";

        apiKeyMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403); // Verifica que se devolvió un error 403
        expect(res.json).toHaveBeenCalledWith({ error: "Acceso denegado. API key inválida o no proporcionada." });
        expect(next).not.toHaveBeenCalled(); // No debería continuar
    });

    it("debería devolver 403 si no se proporciona una clave", () => {
        ensureHeaders(req);
        apiKeyMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403); // Verifica que se devolvió un error 403
        expect(res.json).toHaveBeenCalledWith({ error: "Acceso denegado. API key inválida o no proporcionada." });
        expect(next).not.toHaveBeenCalled(); // No debería continuar
    });
});
