import axiosInstance from "@/api/axios.js";

export const adminLogin = (data) => {
    return axiosInstance.post("/api/admin/login", data, {
        withCredentials: true
    });
};
