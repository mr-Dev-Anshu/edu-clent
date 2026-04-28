import api from "@/lib/axios";

export const login = async (data: FormData) => {
    const response = await api.post("/users/login", data);
    console.log(response.data);
    return response.data; 
};