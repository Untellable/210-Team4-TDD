import { jest } from '@jest/globals';
import GunDBAdaptor from './gun-db-adapator.js';
import GUN from 'gun'; // Import GUN to ensure the mock is used

const mockGun = {
    get: jest.fn().mockReturnThis(),
    put: jest.fn().mockImplementation(() => {}),
    once: jest.fn(),
    set: jest.fn(),
};

jest.mock('gun', () => {
    return jest.fn(() => {
        return mockGun;
    });
});

describe('GunDBAdaptor', () => {
    let gunDbAdaptor;

    beforeEach(() => {
        gunDbAdaptor = new GunDBAdaptor(GUN());
    });
    describe('addUser', () => {
        test('should successfully add a user with valid data', () => {
            const userId = 'user123';
            const userData = { name: 'John Doe', email: 'johndoe@example.com' };

            gunDbAdaptor.addUser(userId, userData);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(userId);
            expect(mockGun.get().get().put).toHaveBeenCalledWith(userData);
        });

        test('should handle attempt to add a user with null data', () => {
            const userId = 'user123';

            gunDbAdaptor.addUser(userId, null);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(userId);
            expect(mockGun.get().get().put).toHaveBeenCalledWith(null);
        });
    });

    describe('getUser', () => {
        test('should successfully retrieve a user when the user exists', async () => {
            const userId = 'user123';
            const mockUserData = {
                _: '#internal',
                name: 'John Doe',
                email: 'johndoe@example.com',
            };
            mockGun
                .get()
                .get()
                .once.mockImplementation((callback) => {
                    callback(mockUserData);
                });

            const result = await gunDbAdaptor.getUser(userId);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(userId);
            expect(mockGun.get().get().once).toHaveBeenCalled();
            expect(result).toEqual({
                name: 'John Doe',
                email: 'johndoe@example.com',
            });
        });

        test('should return null when the user does not exist', async () => {
            const userId = 'user123';
            mockGun
                .get()
                .get()
                .once.mockImplementation((callback) => {
                    callback(null); // Simulates user not found
                });

            const result = await gunDbAdaptor.getUser(userId);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(userId);
            expect(mockGun.get().get().once).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('addFollower', () => {
        test('should successfully add a follower with valid data', () => {
            const userId = 'user123';
            const followerId = 'follower456';
            const followerData = {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
            };

            gunDbAdaptor.addFollower(userId, followerId, followerData);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(followerId);
            expect(mockGun.get().get().put).toHaveBeenCalledWith(followerData);
            expect(mockGun.get().get().get).toHaveBeenCalledWith('followers');
            expect(mockGun.get().get().get().get).toHaveBeenCalledWith(
                followerId
            );
            expect(mockGun.get().get().get().get().set).toHaveBeenCalledWith(
                mockGun.get().get().put()
            );
        });
    });
});
