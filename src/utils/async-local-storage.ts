import { AsyncLocalStorage } from 'async_hooks'

const asyncLocalStorage = new AsyncLocalStorage<{ id: string }>()

export default asyncLocalStorage
