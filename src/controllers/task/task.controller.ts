import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/generated/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const tasks = await prisma.task.findMany();

    if (tasks.length > 0) {
      return res.status(200).json({
        status: 200,
        message: 'success get data',
        data: tasks,
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

export const addTask = async (req: Request, res: Response): Promise<Response | any> => {
  const { name, description, date_start, date_end, status, priority, created_by, projectId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        date_start: new Date(date_start),
        date_end: new Date(date_end),
        status,
        priority,
        project: {
          connect: {
            id: projectId,
          },
        },
        user: {
          connect: {
            id: created_by,
          },
        },
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'success add task',
      data: newTask,
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

export const updateTaskStatus = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;
  const { newStatus } = req.body;
  try {
    const checkTask = await prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!checkTask) {
      return res.status(404).json({
        status: 404,
        message: 'project not found',
        data: null,
      });
    }

    const updateStatus = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        status: newStatus,
      },
    });

    return res.status(200).json({
      status: 200,
      message: 'success update status task',
      data: updateStatus,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed update data',
      data: null,
    });
  }
};

export const updateTaskPriority = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;
  const { priority } = req.body;

  try {
    const checkTask = await prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!checkTask) {
      return res.status(404).json({
        status: 404,
        message: 'task not found',
        data: null,
      });
    }

    const updatePriority = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        priority: priority,
      },
    });

    return res.status(200).json({
      status: 200,
      message: 'success update task priority',
      data: updatePriority,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed update data',
      data: null,
    });
  }
};
