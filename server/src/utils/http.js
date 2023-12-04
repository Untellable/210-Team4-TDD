import axios from 'axios';
const httpInstance = axios.create({
    timeout: 30000
});

export default httpInstance;