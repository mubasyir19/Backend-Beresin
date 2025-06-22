import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/generated/client';

const prisma = new PrismaClient();

export const getCommentsProject = async (req: Request, res: Response): Promise<Response | any> => {
  const { projectId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectId: projectId,
        taskId: null,
      },
      include: {
        user: {
          select: {
            fullname: true,
            username: true,
            bio: true,
            role: true,
          },
        },
      },
    });

    if (comments.length) {
      return res.status(200).json({
        status: 200,
        message: 'success get data',
        data: comments,
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: 'success get data, but null',
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed get data',
      data: null,
    });
  }
};

export const getCommentsTask = async (req: Request, res: Response): Promise<Response | any> => {
  const { projectId, taskId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectId: projectId,
        taskId: taskId,
      },
      include: {
        user: {
          select: {
            fullname: true,
            username: true,
            bio: true,
            role: true,
          },
        },
      },
    });

    if (comments.length) {
      return res.status(200).json({
        status: 200,
        message: 'success get data',
        data: comments,
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: 'success get data, but null',
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed get data',
      data: null,
    });
  }
};

export const addCommentProject = async (req: Request, res: Response): Promise<Response | any> => {
  const { projectId, userId, content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        projectId,
        userId,
        content,
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'success add comment project',
      data: newComment,
    });
  } catch (error) {
    console.log('error = ', error);
    return res.status(500).json({
      status: 500,
      message: 'failed add data',
      data: null,
    });
  }
};

export const addCommentTask = async (req: Request, res: Response): Promise<Response | any> => {
  const { projectId, taskId, userId, content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        projectId,
        taskId,
        userId,
        content,
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'success add comment task',
      data: newComment,
    });
  } catch (error) {
    console.log('error = ', error);
    return res.status(500).json({
      status: 500,
      message: 'failed add data',
      data: null,
    });
  }
};
