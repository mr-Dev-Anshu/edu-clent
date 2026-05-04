import { apiKernel } from '@/config/apiKernel';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

interface PaginatedQueryResult<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: T[];
}

export const kernelHook = <T, CreateDto, UpdateDto>(
  key: string,
  kernel: ReturnType<typeof apiKernel<T, CreateDto, UpdateDto>>
) => ({
  useData: () => 
    useQuery<T[]>({ queryKey: [key, 'all'], queryFn: kernel.fetch, retry: 1 }),

 usePaginatedData: (
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<PaginatedQueryResult<T>, Error>,
    'queryKey' | 'queryFn' | 'placeholderData'
  >
 ) => 
  useQuery<PaginatedQueryResult<T>, Error>({
    queryKey: [key, 'list', { page, limit, ...filters }], 
    queryFn: () => kernel.fetchPage(page, limit, filters),
    placeholderData: keepPreviousData,
    retry: 1,
    ...options,
  }),
  useSingleData: (id: string | number | null) =>
    useQuery<T, Error>({
      queryKey: [key, 'detail', id],
      queryFn: () => kernel.getById(id!),
      enabled: !!id, 
      retry: 1,
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: kernel.create,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: UpdateDto }) => 
        kernel.update(id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: kernel.remove,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  },
});
