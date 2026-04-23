import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ClassRow } from "../types";

export const useClassesWithSections = () => {
  return useQuery<ClassRow[]>({
    queryKey: ["classes-with-sections"],
    queryFn: async () => {
      const res = await api.get("/api/v1/classes/with-sections/all");
      return res.data?.data || [];
    },
  });
};
