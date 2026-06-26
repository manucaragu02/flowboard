import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

const router = Router()

const workspaceSchema = z.object({
  name: z.string().min(1, 'El nombre del workspace es obligatorio'),
})

router.post('/', authenticateToken, async (req, res) => {
  const parsed = workspaceSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ error: z.flattenError(parsed.error) })
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      members: {
        create: {
          userId: req.user.userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      members: true,
      projects: true,
    },
  })

  res.status(201).json(workspace)
})

router.get('/', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: req.user.userId,
        },
      },
    },
    include: {
      members: true,
      projects: true,
    },
  })

  res.json(workspaces)
})

export default router
