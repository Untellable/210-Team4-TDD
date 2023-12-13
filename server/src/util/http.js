import axios from 'axios';
import axiosRetry from 'axios-retry';

const httpInstance = axios.create({
    timeout: 5000,
});

// retry requests whe failed
axiosRetry(httpInstance, {
    retries: 3, // Number of retries
    retryCondition(error) {
        // Conditional check the error status code
        switch (error.response.status) {
            case 404:
            case 429:
                console.log(`retrying request`);
                return true; // Retry request with response status code 404 or 429
            default:
                return false; // Do not retry the others
        }
    },
    retryDelay: axiosRetry.exponentialDelay, // Exponential back-off retry delay between requests
    shouldResetTimeout: true,
});

export default httpInstance;
