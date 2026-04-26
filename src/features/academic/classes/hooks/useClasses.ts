import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";
import { ClassRow, CreateClassPayload, UpdateClassPayload } from "../types";

const classesKernel = apiKernel<
  ClassRow,
  CreateClassPayload,
  UpdateClassPayload
>("/api/v1/classes");

export const classesHook = kernelHook("classes", classesKernel);
