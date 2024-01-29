import { ZodError } from 'zod'

const handleOneLevelZodError = ({ issues }: ZodError<unknown>) => {
  const formData: Record<string, string> = {}

  if (issues.length === 1 && issues[0].path.length < 1) return issues[0].message

  issues.forEach(({ path, message }) => {
    formData[path.join('-')] = message
  })

  return formData
}

export { handleOneLevelZodError }
