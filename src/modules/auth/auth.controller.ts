import type { Request, Response } from "express";
import { registerSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response
) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await registerUser(validationResult.data);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
          error: {
            code: "EMAIL_ALREADY_EXISTS",
          },
        });
      }

      if (error.message === "PHONE_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "Phone number is already registered",
          error: {
            code: "PHONE_ALREADY_EXISTS",
          },
        });
      }
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};