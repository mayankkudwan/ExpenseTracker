import axios from "axios";
const BASE_URL = "http://localhost:4444/api/v1/";
export const publicRequest = axios.create({
    baseURL:BASE_URL
})
