import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Добавим логирование всех запросов
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Axios Config:', {
            baseURL: config.baseURL,
            fullURL: config.url,
            method: config.method
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('3.5 Axios: Получен ответ:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('3.5 Axios: Ошибка ответа:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;