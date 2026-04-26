import { apiKernel } from "@/config/apiKernel";
import { useQuery } from "@tanstack/react-query";
import { ClassRow } from "../types";

const classesKernel = apiKernel<ClassRow>("/api/v1/classes/with-sections/all");

export const useClassesWithSections = () => {
  return useQuery<ClassRow[]>({
    queryKey: ["classes", "with-sections"],
    queryFn: classesKernel.fetch,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
