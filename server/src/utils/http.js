import axios from 'axios';
const httpInstance = axios.create({
    timeout: 5000
});

export default httpInstance;