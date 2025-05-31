import { Request, Response } from "express";
import {
  asyncErrorHandler,
  createError,
  sendSuccessResponse,
} from "../helpers";
import { CreateRoomSchema } from "@repo/common/types";
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "@repo/db/prismaClient";

// POST /rooms
export const createRoom = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const isRoomDataValid = CreateRoomSchema.isValid(req.body);

    if (!isRoomDataValid) {
      createError({
        message: "Invalid data received",
        statusCode: StatusCodes.BAD_REQUEST,
      });
      return;
    }

    const room = await prismaClient.room.create({
      data: {
        slug: req.body.slug,
        userId: req.userId,
        description: req.body.description,
      },
    });

    sendSuccessResponse({
      res,
      statusCode: StatusCodes.CREATED,
      data: {
        roomId: room,
      },
      message: "New room created",
    });
  },
);

// GET /rooms
export const getAllRooms = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const rooms = await prismaClient.room.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    sendSuccessResponse({
      res,
      data: rooms,
      message: "All rooms fetched successfully",
    });
  },
);

// GET /rooms/user/:userId
export const getRoomsByUserId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const rooms = await prismaClient.room.findMany({
      where: {
        userId: req.params.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    sendSuccessResponse({
      res,
      data: rooms,
      message: "All rooms fetched successfully",
    });
  },
);

// GET /rooms/slug/:slug
export const getRoomDetailsBySlug = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });

    sendSuccessResponse({
      res,
      data: room,
      message: "Room details by slug",
    });
  },
);
