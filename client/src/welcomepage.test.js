/*global document*/
import { JSDOM } from 'jsdom';

// Mocking the imported functions from validate.js
jest.mock('./validate.js', () => ({
    hideError: jest.fn(),
    showForm: jest.fn(),
    hideAccount: jest.fn(),
    clearInput: jest.fn(),
    recoverErrorMessage: jest.fn(),
    emptyInputHandler: jest.fn(),
    getInput: jest.fn(),
    validateInput: jest.fn(),
}));

// Setting up the DOM for testing
const html = `
    <div class="expandable-container">
        <button class="expandable-trigger"></button>
        <div class="expandable-content" style="display: none;"></div>
    </div>
    <button id="submit-btn"></button>
    <button id="no-btn"></button>
    <button id="yes-btn"></button>
`;
const dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window;

// Importing the script to be tested
require('./welcomepage.js');

describe('welcomepage event listeners', () => {
    beforeEach(() => {
        // Resetting mocks before each test
        jest.clearAllMocks();
    });

    test('expandable container toggle', () => {
        const expandableTrigger = document.querySelector('.expandable-trigger');
        const expandableContent = document.querySelector('.expandable-content');
        expandableTrigger.click();
        expect(expandableContent.style.display).toBe('block');
        expandableTrigger.click();
        expect(expandableContent.style.display).toBe('none');
    });
});
