import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import authRoutes from './routes/auth.routes.js'
import workspaceRoutes from './routes/workspace.routes.js'
import projectRoutes from './routes/project.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/workspaces/:workspaceId/projects', projectRoutes)
app.use('/api/projects/:projectId/tasks', taskRoutes)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(500).json({
    error: 'Internal Server Error',
    ...(isDev && { message: err.message }),
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
