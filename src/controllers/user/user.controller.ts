import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/generated/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const addUser = async (req: Request, res: Response): Promise<Response | any> => {
  const { fullname, bio, email, username, password, role } = req.body;

  try {
    const checkUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (checkUser) {
      return res.status(400).json({
        status: 400,
        message: 'account already registered',
        data: null,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        bio,
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'an account successfully register',
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed add new account',
      data: null,
    });
  }
};
