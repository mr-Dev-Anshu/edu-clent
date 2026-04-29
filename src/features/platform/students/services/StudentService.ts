import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";
import {
  CreateStudentDto,
  StudentType,
  UpdateStudentDto,
} from "../types";

const studentKernel = apiKernel<
  StudentType,
  CreateStudentDto,
  UpdateStudentDto
>("/students");

export const useStudentService = kernelHook<
  StudentType,
  CreateStudentDto,
  UpdateStudentDto
>("students", studentKernel);
