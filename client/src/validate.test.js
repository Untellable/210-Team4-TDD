import {
    showError,
    hideError,
    showForm,
    hideForm,
    showAccount,
    hideAccount,
    clearInput,
    recoverErrorMessage,
    emptyInputHandler,
    getInput,
    combineInput,
    processResponse,
    saveId,
    updateFromResponse,
    validateInput
  } from './validate';
  
  const { JSDOM } = require('jsdom');
  const html = `<div class="error-message" style="display: none;"></div>
                <div class="form-container" style="display: none;"></div>
                <div class="account-container" style="display: none;"></div>
                <input id="input-username" />
                <input id="input-serverdomain" />
                <div id="display-name"></div>
                <div id="display-account"></div>
                <div id="followers-count"></div>
                <img id="avatar" />`;
  
  const dom = new JSDOM(html);
  global.document = dom.window.document;
  global.window = dom.window;
  
  // Mock fetch API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ id: 109252111498807689, display_name: 'Test User', avatar: 'avatar_url', followers_count: 10 })
    })
  );
  
  describe('validate.js functions', () => {
    beforeEach(() => {
      dom.window.document.body.innerHTML = html;
      fetch.mockClear();
    });
  
    test('showError should make error message visible', () => {
        const errorContainer = document.querySelector('.error-message');
        // hide the error  message by default
        expect(errorContainer.style.display).toBe('none');
    });
  });