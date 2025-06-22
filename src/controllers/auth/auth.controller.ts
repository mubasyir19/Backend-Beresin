import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/generated/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<Response | any> => {
  const { username, password } = req.body;

  try {
    const checkUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!checkUser) {
      return res.status(404).json({
        status: 404,
        message: 'account not found',
        data: null,
      });
    }

    const checkPassword = bcrypt.compareSync(password, checkUser.password);

    if (!checkPassword) {
      return res.status(400).json({
        status: 400,
        message: 'wrong password',
        data: null,
      });
    }

    const user = {
      id: checkUser.id,
      fullname: checkUser.fullname,
      bio: checkUser.bio,
      username: checkUser.username,
      email: checkUser.email,
      role: checkUser.role,
    };

    const token = jwt.sign(user, process.env.SECRET_KEY as string);

    return res.status(200).json({
      status: 200,
      message: 'login successfully',
      data: {
        id: user.id,
        role: user.role,
        access_token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed login',
      data: null,
    });
  }
};
