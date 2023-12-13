import axios from 'axios';
import axiosRetry from 'axios-retry';

const httpInstance = axios.create({
    timeout: 1000,
});

// retry requests whe failed
axiosRetry(httpInstance, {
    retries: 3, // Number of retries
    retryCondition(error) {
        // Check for timeout error
        if (error.code === 'ECONNABORTED') {
            console.log('retrying request due to timeout');
            return true;
        }

        // Ensure error.response exists before accessing status
        if (
            error.response &&
            (error.response.status === 404 || error.response.status === 429)
        ) {
            console.log('retrying request');
            return true;
        }

        return false;
    },
    retryDelay: axiosRetry.exponentialDelay, // Exponential back-off retry delay between requests
    shouldResetTimeout: true,
});

export default httpInstance;
