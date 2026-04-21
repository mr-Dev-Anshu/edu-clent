export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
  module: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  roleType: 'admin' | 'staff' | 'portal' | 'platform'; 
  permissions: Permission[];
}

export interface TenantSettings {
  currency: string;
  timezone: string;
  hasHostel: boolean;
  hasTransport: boolean;
  gradingSystem: string;
  academicStructure: string;
}

export interface Tenant {
  id: string;
  name: string;
  organizationType: string;
  officialEmail: string;
  subdomain: string;
  settings: TenantSettings;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string;
  preferences: {
    theme: string;
    language: string;
  };
  roles: Role[];
  tenant: Tenant | null; 
  token: string;
}