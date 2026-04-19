import api from "@/lib/axios";

export const logout = async () => {
    const response = await api.post("/api/v1/users/logout");
    return response.data; 
};