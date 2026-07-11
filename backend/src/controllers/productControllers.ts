import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
// function with pagination, filtering, and search queries n stuff
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort, minPrice, maxPrice, page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    if (limitNum > 100) {
      res.status(413).json({ message: "Page size larger than 100" });
      return;
    }

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

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};

      if (minPrice !== undefined) {
        const min = parseFloat(minPrice as string);
        if (!isNaN(min)) whereClause.price.gte = min;
      }

      if (maxPrice !== undefined) {
        const max = parseFloat(maxPrice as string);
        if (!isNaN(max)) whereClause.price.lte = max;
      }

      // If neither parsed to a valid number, drop the empty filter object
      if (Object.keys(whereClause.price).length === 0) {
        delete whereClause.price;
      }
    }

    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price_asc") orderByClause = { price: "asc" };
    if (sort === "price_desc") orderByClause = { price: "desc" };

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

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
      return;
    }
    const product = await prisma.product.findUnique({
     where: { id: id as string },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server encountered an error while retrieving the product.",
    });
  }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, imagelink, price, category } = req.body;
    
    if (!name || !imagelink || !price || !category) {
      res.status(400).json({
        success: false,
        message: "give me all the data, you dumbass.",
      });
      return;
    } 
    const product = await prisma.product.create({
      data: {
        name: name as string,
        price: parseFloat(price as string),
        category: category as string,
        imagelink: imagelink as string
      },
    });
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server encountered an error while creating the product.",
    });
  }
}




export const updateProductRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewRating, reviewCount } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
      return;
    }

    if (reviewRating === undefined && reviewCount === undefined) {
      res.status(400).json({
        success: false,
        message: "Provide reviewRating and/or reviewCount to update.",
      });
      return;
    }

    const data: { reviewRating?: number; reviewCount?: number } = {};

    if (reviewRating !== undefined) {
      const parsedRating = Number(reviewRating);
      if (!Number.isInteger(parsedRating) || parsedRating < 0 || parsedRating > 10) {
        res.status(400).json({
          success: false,
          message: "reviewRating must be an integer between 0 and 10.",
        });
        return;
      }
      data.reviewRating = parsedRating;
    }

    if (reviewCount !== undefined) {
      const parsedCount = Number(reviewCount);
      if (!Number.isInteger(parsedCount) || parsedCount < 0) {
        res.status(400).json({
          success: false,
          message: "reviewCount must be a non-negative integer.",
        });
        return;
      }
      data.reviewCount = parsedCount;
    }

    const existing = await prisma.product.findUnique({ where: { id: id as string } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    const product = await prisma.product.update({
      where: { id: id as string },
      data,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
    res.status(500).json({
      success: false,
      message: "Server encountered an error while updating the product rating.",
    });
  }
};
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, imagelink, price, category } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
      return;
    }

    if (
      name === undefined &&
      imagelink === undefined &&
      price === undefined &&
      category === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
      return;
    }

    const data: { name?: string; imagelink?: string; price?: number; category?: string } = {};

    if (name !== undefined) data.name = name as string;
    if (imagelink !== undefined) data.imagelink = imagelink as string;
    if (category !== undefined) data.category = category as string;

    if (price !== undefined) {
      const parsedPrice = parseFloat(price as string);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        res.status(400).json({
          success: false,
          message: "price must be a valid non-negative number.",
        });
        return;
      }
      data.price = parsedPrice;
    }

    const existing = await prisma.product.findUnique({ where: { id: id as string } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    const product = await prisma.product.update({
      where: { id: id as string },
      data,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server encountered an error while updating the product.",
    });
  }
};