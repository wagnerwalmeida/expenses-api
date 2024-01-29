import { handleOneLevelZodError } from '@/utils/zod-error'
import { ZodError } from 'zod'

export function requestHandlerError(error: any) {
  if (error instanceof ZodError) {
    return { error: handleOneLevelZodError(error) }
  } else {
    return { error }
  }
}
