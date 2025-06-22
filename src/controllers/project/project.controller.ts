import { Request, Response } from 'express';
import { PrismaClient, ProjectStatus, TaskStatus } from '../../../prisma/generated/client';
import { allowedTransitions } from '../../helpers/flowProject';

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        date_start: true,
        date_end: true,
        status: true,
        priority: true,
        created_by: true,
        ProjectMember: {
          select: {
            id: true,
            projectId: true,
            userId: true,
            user: {
              select: {
                fullname: true,
              },
            },
            role: true,
            joinedAt: true,
          },
        },
        Task: true,
      },
    });

    if (projects.length > 0) {
      return res.status(200).json({
        status: 200,
        message: 'success get data',
        data: projects,
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

export const addProject = async (req: Request, res: Response): Promise<Response | any> => {
  const { name, description, date_start, date_end, status, priority, created_by } = req.body;

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        date_start: new Date(date_start),
        date_end: new Date(date_end),
        status,
        priority,
        created_by,
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'success add project',
      data: newProject,
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

export const addMemberProject = async (req: Request, res: Response): Promise<Response | any> => {
  const { projectId, userId, role, joinedAt } = req.body;

  try {
    const addMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
        joinedAt,
      },
    });

    return res.status(201).json({
      status: 201,
      message: 'success add member project',
      data: addMember,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'failed add data',
      data: null,
    });
  }
};

export const updateProjectStatus = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;
  const { newStatus } = req.body;
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: id,
      },
      include: {
        Task: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: 'project not found',
        data: null,
      });
    }

    const allowedNext = allowedTransitions[project.status];

    if (!allowedNext.includes(newStatus)) {
      return res.status(400).json({ error: `Invalid status transition from ${project.status} to ${newStatus}` });
    }

    if (newStatus === ProjectStatus.ON_HOLD || newStatus === ProjectStatus.COMPLETED) {
      const allTasksCompleted = project.Task.every((task) => task.status === TaskStatus.COMPLETED);
      if (!allTasksCompleted) {
        return res.status(400).json({ error: 'Selesaikan semua tugas terlebih dahulu' });
      }
    }

    const updateStatus = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        status: newStatus,
      },
    });

    return res.status(200).json({
      status: 200,
      message: 'success update status project',
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

export const updateProjectPriority = async (req: Request, res: Response): Promise<Response | any> => {
  const { id } = req.params;
  const { priority } = req.body;

  try {
    const checkProject = await prisma.project.findFirst({
      where: {
        id: id,
      },
    });

    if (!checkProject) {
      return res.status(404).json({
        status: 404,
        message: 'project not found',
        data: null,
      });
    }

    const updatePriority = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        priority: priority,
      },
    });

    return res.status(200).json({
      status: 200,
      message: 'success update priority project',
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
