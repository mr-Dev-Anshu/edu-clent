import { apiKernel } from "@/config/apiKernel";

export interface Tenant {
  id: string;
  name: string;
  organizationType: string;
  officialEmail: string;
  subdomain: string;
  portalUrl: string;
  status: 'active' | 'inactive' | 'suspended';
  planName: string;
  studentCount: number;
}

export const tenantService = apiKernel<Tenant>("/tenants");