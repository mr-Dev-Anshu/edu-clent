import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface HeaderState {
  moduleName: string;
  actions: {
    label: string;
    iconName?: string; 
    variant?: 'primary' | 'secondary' | 'outline';
    emitEvent: string;
  }[];
  items: { label: string; href: string }[];
}

const initialState: HeaderState = {
  moduleName: 'Dashboard',
  actions: [],
  items:[]
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeaderConfig: (state, action: PayloadAction<HeaderState>) => {
      state.moduleName = action.payload.moduleName;
      state.actions = action.payload.actions;
      state.items=action.payload.items;
    },
    clearHeaderConfig: (state) => {
      state.moduleName = '';
      state.actions = [];
      state.items=[]
    },
  },
});

export const { setHeaderConfig, clearHeaderConfig } = headerSlice.actions;
export default headerSlice.reducer;