import { kernelHook } from "@/hooks/useKernel";
import { tenantService } from "../services";


export const useTenant = kernelHook("tenants", tenantService);