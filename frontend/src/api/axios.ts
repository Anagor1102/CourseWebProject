import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5155/api',
    withCredentials: true
});

export default instance;