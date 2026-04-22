import { apiKernel } from '@/config/apiKernel'
import { kernelHook } from '@/hooks/useKernel'
import { ClassRow, CreateClassPayload } from '../types'

const classesKernel = apiKernel<ClassRow, CreateClassPayload, Partial<CreateClassPayload>>(
  '/api/v1/classes'
)

// kernelHook returns the hook object directly — use it like:
// const { data, isLoading } = classesHook.useData()
export const classesHook = kernelHook('classes', classesKernel)