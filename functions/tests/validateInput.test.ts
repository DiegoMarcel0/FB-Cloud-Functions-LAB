//Este archivo contiene pruebas unitarias para la función validateInput.
// La función validateInput valida que el tagId proporcionado en la solicitud sea una cadena de 10 caracteres.
import { validateInput } from "../src/Seguridad/validateInput";
import { Request, Response, NextFunction } from "express";

describe("validateInput", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("debería devolver 400 si no se proporciona tagId", () => {
        validateInput(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Datos inválidos. El tagId debe ser una cadena de 10 caracteres." });
    });

    it("debería devolver 400 si tagId no es una cadena de 10 caracteres", () => {
        req.body = { tagId: "123" };
        validateInput(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Datos inválidos. El tagId debe ser una cadena de 10 caracteres." });
    });

    it("debería llamar a next si tagId es válido", () => {
        req.body = { tagId: "1234567890" };
        validateInput(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
