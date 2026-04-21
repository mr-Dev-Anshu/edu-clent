import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Permission, Role, Tenant, TenantSettings, UserData } from '../types/index';

interface AuthState {
  token: string | null;
  user: UserData | null;
  roles: Role[]; 
  permissions: string[]; 
  tenant: Tenant | null;
  settings: TenantSettings | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  roles: [],
  permissions: [],
  tenant: null,
  settings: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (user.tenant) {
        state.tenant = user.tenant;
        state.settings = user.tenant.settings;
      } else {
        state.tenant = null;
        state.settings = null;
      }

      if (user.roles) {
        state.roles = user.roles;
        const allPerms = user.roles.flatMap((role) =>
          role.permissions.map((p: Permission) => p.name)
        );
        state.permissions = Array.from(new Set(allPerms));
      }
    },

    updateTenantSettings: (state, action: PayloadAction<Partial<TenantSettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },

    updateUserProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout: (state) => {
      return initialState;
    },
  },
});

export const { 
  setCredentials, 
  logout, 
  updateTenantSettings, 
  updateUserProfile 
} = authSlice.actions;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectTenant = (state: { auth: AuthState }) => state.auth.tenant;
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state:{auth:AuthState})=> state.auth.isAuthenticated
export const selectIsSuperAdmin = (state: { auth: AuthState }) => 
    state.auth.roles.some(r => r.roleType === 'admin') && !state.auth.tenant;

export default authSlice.reducer;