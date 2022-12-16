import axios from "axios";

import { setupInterceptorsTo } from "./interceptors";

const API_URL = process.env.REACT_APP_API_URL;

const config = {
  baseURL: `${API_URL}`,
};

const instance = axios.create(config);

setupInterceptorsTo(instance);

export default instance;
