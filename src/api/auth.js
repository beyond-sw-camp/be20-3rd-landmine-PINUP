import axios from "axios";

export const adminLogin = (data) => {
    return axios.post("http://localhost:8080/api/admin/login", data);
};
