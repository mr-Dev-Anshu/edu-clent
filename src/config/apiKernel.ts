import api from "@/lib/axios";

interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: T[]; // Actual array yahan hai
}

export const apiKernel = <T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  path: string
) => ({
  fetch: () => api.get<{ data: T[] }>(path).then(r => r.data?.data || []),

  fetchPage: (page: number = 1, limit: number = 10, filter?: object) => 
    api.get<PaginatedResponse<T>>(path, {
      params: { page, limit, ...filter }
    }).then(r => r.data), 

  getById: (id: string | number) => 
    api.get<{ data: T }>(`${path}/${id}`).then(r => r.data?.data),

  create: (data: CreateDto) => api.post<T>(path, data).then(r => r.data),

  update: (id: string | number, data: UpdateDto) => 
    api.patch<T>(`${path}/${id}`, data).then(r => r.data),

  remove: (id: string | number) => api.delete(`${path}/${id}`).then(r => r.data),
});