// Import the functions to be tested
import { showOverlay, hideOverlay, showSpinner, hideSpinner } from './ui.js';

const { JSDOM } = require('jsdom');

// Load the HTML file containing the functions
const html = '<div id="overlay"></div><div id="loadingSpinner"></div>';
const dom = new JSDOM(html);
global.document = dom.window.document;

describe('Overlay and Spinner Functions', () => {
    beforeEach(() => {
        // Reset the DOM before each test
        dom.window.document.getElementById('overlay').style.display = 'none';
        dom.window.document.getElementById('loadingSpinner').style.display =
            'none';
    });

    test('showOverlay should set display to block', () => {
        showOverlay();
        expect(
            dom.window.document.getElementById('overlay').style.display
        ).toBe('block');
    });

    test('hideOverlay should set display to none', () => {
        hideOverlay();
        expect(
            dom.window.document.getElementById('overlay').style.display
        ).toBe('none');
    });

    test('showSpinner should set overlay and loadingSpinner display to block', () => {
        showSpinner();
        expect(
            dom.window.document.getElementById('overlay').style.display
        ).toBe('block');
        expect(
            dom.window.document.getElementById('loadingSpinner').style.display
        ).toBe('block');
    });

    test('hideSpinner should set overlay and loadingSpinner display to none', () => {
        hideSpinner();
        expect(
            dom.window.document.getElementById('overlay').style.display
        ).toBe('none');
        expect(
            dom.window.document.getElementById('loadingSpinner').style.display
        ).toBe('none');
    });
});
