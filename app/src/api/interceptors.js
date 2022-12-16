import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const onRequest = (config) => {
  const authToken = sessionStorage.getItem("authToken") || "";
  if (authToken !== null && authToken !== undefined) {
    return {
      ...config,
      headers: {
        Authorization: authToken,
      },
    };
  }
  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  return response;
};

const onResponseError = async (error) => {
  if (!error.response) return Promise.reject(error);

  if (error.response.status === 401) {
    const { initData } = window.Telegram.WebApp;
    const config = error.config;
    try {
      const response = await fetch(`${API_URL}/api/v1/users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData,
        }),
      });

      const responseData = await response.json();

      if (responseData) {
        config.headers = {
          ...config.headers,
          Authorization: responseData.value,
        };
        sessionStorage.setItem("authToken", responseData.value);
      }
      return axios(config);
    } catch (_error) {
      return Promise.reject(_error);
    }
  } else if (error.response.status >= 500) {
    console.error(
      `API error. URL: ${error.response.config.url}. STATUS: ${error.response.status}`
    );
  }

  return Promise.reject(error);
};

export function setupInterceptorsTo(axiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
