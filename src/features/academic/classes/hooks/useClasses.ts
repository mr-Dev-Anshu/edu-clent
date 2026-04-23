// src/features/academic/classes/hooks/useClasses.ts

// import { apiKernel } from "@/config/apiKernel";
// import { kernelHook } from "@/hooks/useKernel";
// import { ClassRow, CreateClassPayload } from "../types";

// const classesKernel = apiKernel<
//   ClassRow,
//   CreateClassPayload,
//   Partial<CreateClassPayload>
// >("/api/v1/classes");

// export const classesHook = kernelHook("classes", classesKernel);

// src/features/academic/classes/hooks/useClasses.ts
// src/features/academic/classes/hooks/useClasses.ts

import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";
import { ClassRow, CreateClassPayload } from "../types";

const classesKernel = apiKernel<
  ClassRow,
  CreateClassPayload,
  Partial<CreateClassPayload>
>("/api/v1/classes");

export const classesHook = kernelHook("classes", classesKernel);
