import api from "@/lib/axios";

export const logout = async () => {
    const response = await api.post("/users/logout");
    return response.data; 
};