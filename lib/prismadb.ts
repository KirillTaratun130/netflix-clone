import { PrismaClient } from '../prisma/client/client'

const client = global.prismadb || new PrismaClient()
if (process.env.NODE_ENV === 'production') global.prismadb = client

export default client