import {  Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const taskSchema = z.object({
  title: z.string().min(1, "El nombre de la tarea es obligatorio"),
});

router.post('/', authenticateToken, async (req, res) => {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: z.flattenError(parsed.error) });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const projectId = req.params.projectId as string;
    if (!projectId) {
        return res.status(400).json({ error: 'No se ha especificado el proyecto' });
    }

    const isMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: req.user.userId,
            workspace: {
                projects: {
                    some: {
                        id: projectId,
                    }
                }
            }
        }
    });

    if (!isMember) {
        return res.status(403).json({ error: 'No tienes permisos para crear tareas en este proyecto' });
    }

    const task = await prisma.task.create({
        data: {
            title: parsed.data.title,
            projectId: projectId,
        },
    });

    res.status(201).json(task);
});

router.get('/', authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const projectId = req.params.projectId as string;
    if (!projectId) {
        return res.status(400).json({ error: 'No se ha especificado el proyecto' });
    }

    const isMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: req.user.userId,
            workspace: {
                projects: {
                    some: {
                        id: projectId,
                    }
                }
            }
        }
    });

    if (!isMember) {
        return res.status(403).json({ error: 'No tienes permisos para ver tareas en este proyecto' });
    }

    const tasks = await prisma.task.findMany({
        where: {
            projectId: projectId,
        },
    });

    res.json(tasks);
});

const updateTaskSchema = z.object({
    title: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
});

router.patch('/:taskId', authenticateToken, async (req, res) => {
    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: z.flattenError(parsed.error) });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const taskId = req.params.taskId as string;
    if (!taskId) {
        return res.status(400).json({ error: 'No se ha especificado la tarea' });
    }

    const projectId = req.params.projectId as string;
    if (!projectId) {
        return res.status(400).json({ error: 'No se ha especificado el proyecto' });
    }

    const isMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: req.user.userId,
            workspace: {
                projects: {
                    some: {
                        id: projectId,
                    }
                }
            }
        }
    });

    if (!isMember) {
        return res.status(403).json({ error: 'No tienes permisos para actualizar esta tarea' });
    }

    const task = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            ...(parsed.data.title && { title: parsed.data.title }),
            ...(parsed.data.status && { status: parsed.data.status }),
        },
    });

    res.json(task);
});

export default router;