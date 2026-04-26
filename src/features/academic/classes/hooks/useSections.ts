import { apiKernel } from "@/config/apiKernel";
import { kernelHook } from "@/hooks/useKernel";

const sectionsKernel = apiKernel("/api/v1/sections");

export const sectionsHook = kernelHook("sections", sectionsKernel);
