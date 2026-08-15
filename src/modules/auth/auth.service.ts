import bcrypt from "bcrypt";
import prisma from "../../config/database.js";
import type { RegisterInput } from "./auth.schema.js";

export const registerUser = async (data: RegisterInput) => {
  const email = data.email.trim().toLowerCase();
  const phoneNumber = data.phoneNumber.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          phoneNumber,
        },
      ],
    },
    select: {
      email: true,
      phoneNumber: true,
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    if (existingUser.phoneNumber === phoneNumber) {
      throw new Error("PHONE_ALREADY_EXISTS");
    }
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      phoneNumber,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
    },
  });

  return user;
};