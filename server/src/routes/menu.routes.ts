import { Router } from 'express'
import { menu } from '../domain/menu.js'

export const menuRouter = Router()
menuRouter.get('/', (_request, response) => response.json({ data: menu }))
