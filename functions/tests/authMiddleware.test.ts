import { authMiddleware } from "../src/Seguridad/authMiddleware";
import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

jest.mock("firebase-admin", () => ({
    auth: jest.fn(() => ({
        verifyIdToken: jest.fn()
    }))
}));

describe("authMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("debería devolver 401 si no se proporciona un token", async () => {
        await authMiddleware(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "No se proporcionó un token de autenticación." });
    });

    it("debería devolver 403 si el token es inválido", async () => {
        (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(new Error("Token inválido"));
        req.headers = { authorization: "Bearer invalidToken" };

        await authMiddleware(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Token de autenticación inválido." });
    });

    it("debería llamar a next si el token es válido", async () => {
        (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue({ uid: "12345" });
        req.headers = { authorization: "Bearer validToken" };

        await authMiddleware(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ uid: "12345" });
    });
});
