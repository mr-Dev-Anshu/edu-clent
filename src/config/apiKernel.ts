import api from "@/lib/axios";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    pageSize: number;
  };
}

export const apiKernel = <T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  path: string
) => ({
  fetch: () => api.get<{ data: T[] }>(path).then(r => r.data?.data || []),

  fetchPage: (page: number = 1, limit: number = 10, search?: string) => 
    api.get<PaginatedResponse<T>>(path, {
      params: { page, limit, search }
    }).then(r => r.data),

  getById: (id: string | number) => 
    api.get<{ data: T }>(`${path}/${id}`).then(r => r.data?.data),

  create: (data: CreateDto) => api.post<T>(path, data).then(r => r.data),

  update: (id: string | number, data: UpdateDto) => 
    api.put<T>(`${path}/${id}`, data).then(r => r.data),

  remove: (id: string | number) => api.delete(`${path}/${id}`).then(r => r.data),
});