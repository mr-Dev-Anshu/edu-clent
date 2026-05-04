import { apiKernel } from '@/config/apiKernel';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';

export const kernelHook = <T, CreateDto, UpdateDto>(
  key: string,
  kernel: ReturnType<typeof apiKernel<T, CreateDto, UpdateDto>>
) => ({
  useData: () => 
    useQuery({ queryKey: [key, 'all'], queryFn: kernel.fetch, retry: 1 }),

 usePaginatedData: (page: number = 1, limit: number = 10, filters?: any) => 
  useQuery({
    queryKey: [key, 'list', { page, limit, ...filters }], 
    queryFn: () => kernel.fetchPage(page, limit, filters),
    placeholderData: keepPreviousData,
    retry: 1,
  }),
  useSingleData: (id: string | number | null) =>
    useQuery({
      queryKey: [key, 'detail', id],
      queryFn: () => kernel.getById(id!),
      enabled: !!id, 
      retry: 1,
    }),

  useCreate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: kernel.create,
      onSuccess: () => qc.refetchQueries({ queryKey: [key] }),
    });
  },

  useUpdate: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: UpdateDto }) => 
        kernel.update(id, data),
      onSuccess: () => qc.refetchQueries({ queryKey: [key] }),
    });
  },

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: kernel.remove,
      onSuccess: () => qc.refetchQueries({ queryKey: [key] }),
    });
  },
});