import type { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({message: "Test GET controller"})
    } catch (error) {
        console.error(error)
    }
};
