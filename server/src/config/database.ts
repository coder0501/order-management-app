import mongoose from 'mongoose'

export async function connectDatabase(uri?: string) {
  if (!uri) return false

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
    return true
  } catch {
    console.warn('MongoDB unavailable; using in-memory repository')
    return false
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}
