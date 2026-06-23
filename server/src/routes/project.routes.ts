import {  Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const projectSchema = z.object({
  name: z.string().min(1, "El nombre del proyecto es obligatorio"),
});

router.post('/', authenticateToken, async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: z.flattenError(parsed.error) });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) {
        return res.status(400).json({ error: 'No se ha especificado el workspace' });
    }

    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: req.user.userId,
                workspaceId: workspaceId,
            }
        }
    });
    if (!isMember) {
        return res.status(403).json({ error: 'No tienes permisos para crear proyectos en este workspace' });
    }

    const project = await prisma.project.create({
        data: {
            name: parsed.data.name,
            workspaceId: workspaceId,
        },
        include: {
            tasks: true,
        }
    });

    res.status(201).json(project);
});

router.get('/', authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) {
        return res.status(400).json({ error: 'No se ha especificado el workspace' });
    }

    const isMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: req.user.userId,
                workspaceId: workspaceId,
            }
        }
    });
    if (!isMember) {
        return res.status(403).json({ error: 'No tienes permisos para crear proyectos en este workspace' });
    }

    const projects = await prisma.project.findMany({
        where: {
            workspaceId: workspaceId,
        },
        include: {
            tasks: true,
        },
    });

    res.json(projects);
});

export default router;