module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.js$': 'babel-jest', // Add this line for .js files
    },
    testMatch: ['../src/**/*.test.js', '../src/**/**/*.test.js'],
};