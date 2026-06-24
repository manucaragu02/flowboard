import { Request, Response, Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'

function verifyToken(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      secret,
      (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) reject(err)
        else resolve(decoded as JwtPayload)
      },
    )
  })
}

const router = Router()

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ error: z.flattenError(parsed.error) })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  if (existingUser) {
    return res
      .status(409)
      .json({ error: 'El correo electrónico ya está registrado' })
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password: hashedPassword,
      name: parsed.data.name,
    },
  })

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
  })
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ error: z.flattenError(parsed.error) })
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }

  const isPasswordValid = await bcrypt.compare(
    parsed.data.password,
    user.password,
  )

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' },
  )
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' },
  )

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
  })

  return res.status(200).json({ userId: user.id, accessToken, refreshToken })
})

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: 'Token de actualización no proporcionado' })
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })
  if (!storedToken) {
    return res.status(403).json({ error: 'Token de actualización inválido' })
  }

  if (new Date() > storedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    return res.status(403).json({ error: 'Token de actualización expirado' })
  }

  try {
    const decoded = await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    )
    const userId = decoded.userId
    const newAccessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' },
    )
    return res.status(200).json({ accessToken: newAccessToken })
  } catch (err) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    return res.status(403).json({ error: 'Token de actualización inválido' })
  }
})

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: 'Token de actualización no proporcionado' })
  }

  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })

  return res.status(200).json({ message: 'Cierre de sesión exitoso' })
})

export default router
