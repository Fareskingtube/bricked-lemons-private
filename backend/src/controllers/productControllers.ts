import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (search) {
      whereClause.name = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    if (category) {
      whereClause.category = category as string;
    }

    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price_asc") orderByClause = { price: "asc" };
    if (sort === "price_desc") orderByClause = { price: "desc" };

    // Fetch the products and total count concurrently
    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum,
      },
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server encountered an error while retrieving products.",
    });
  }
};
