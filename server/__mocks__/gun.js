// __mocks__/gun.js
import {jest} from "@jest/globals";

const mockGun = {
    get: jest.fn().mockReturnThis(),
    put: jest.fn().mockImplementation(() => mockReference),
    once: jest.fn(),
    set: jest.fn(),
};

let mockReference = {};
mockGun.get.mockReturnValue(mockGun); // Mock chaining

export default jest.fn(() => mockGun);

