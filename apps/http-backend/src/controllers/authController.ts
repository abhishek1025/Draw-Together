import { Request, Response } from "express";
import {
  asyncErrorHandler,
  createError,
  sendSuccessResponse,
} from "../helpers";
import jwt from "jsonwebtoken";
import { CLIENT_URL, JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
} from "@repo/common/types";
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "@repo/db/prismaClient";
import { hashPassword } from "../utils";
import bcrypt from "bcrypt";
import { emailServices } from "../services";

// POST /auth/sign-up
export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
  const isCreateUserDataValid = await CreateUserSchema.isValid(req.body);

  if (!isCreateUserDataValid) {
    createError({
      message: "Invalid data received",
      statusCode: StatusCodes.CONFLICT,
    });
    return;
  }

  const isUserExist = await prismaClient.user.findFirst({
    where: {
      email: req.body?.email,
    },
  });

  if (isUserExist) {
    createError({
      message: "User already exists with this email",
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const hashedPassword = await hashPassword(req.body.password);

  // Create a new user
  await prismaClient.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    },
  });

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
  });
});

// POST /auth/sign-in
export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const isSignInDataValid = await SignInSchema.isValid(req.body);

  if (!isSignInDataValid) {
    createError({
      message: "Invalid data received",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: req.body?.email,
    },
  });

  const isPasswordValid = await bcrypt.compare(
    req.body?.password ?? "",
    user?.password ?? "",
  );

  if (!user || !isPasswordValid) {
    createError({
      message: "Username or password incorrect",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const tokenExpiryTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  const token = jwt.sign({ userId: user?.id }, JWT_SECRET, {
    expiresIn: tokenExpiryTime,
  });

  res.cookie("token", token, {
    // httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: tokenExpiryTime, // 7 days in milliseconds
  });

  sendSuccessResponse({
    res,
    data: {
      token,
      user: {...user, password: ''},
    },
    message: "Successfully logged in",
  });
});

// POST /auth/forgot-password
export const forgotPassword = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const isDataValid = await ForgotPasswordSchema.isValid(req.body);

    if (!isDataValid) {
      createError({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid data received",
      });

      return;
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: req.body?.email,
      },
    });

    if (!user) {
      createError({
        statusCode: StatusCodes.NOT_FOUND,
        message: "User does not exist with this email",
      });

      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: 15 * 60 * 1000, // 15 Min in MS
    });

    const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <p>Dear ${user.name},</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <p style="text-align: center;">
      <a href="${CLIENT_URL}/reset-password?token=${token}">
         style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p>Note: This link will expire in 15 Minutes</p>
    <p>If you didn’t request this, please ignore this email.</p>
    <p>Thank You </p>
  </div>
`;

    emailServices.sendEmail({
      to: user.email,
      subject: "Reset Password Request",
      htmlBody: htmlBody,
    });

    sendSuccessResponse({
      res,
      message: "Please check email for reset password link.",
    });
  },
);

// POST /auth/reset-password
export const resetPassword = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    const isValidData = await ResetPasswordSchema.isValid(req.body);

    if (!isValidData) {
      createError({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid data received",
      });

      return;
    }

    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      createError({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User does not found",
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prismaClient.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    sendSuccessResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Your password is reset successfully.",
    });
  },
);
