import GunDBAdaptor from './gun-db-adapator.js'; // Update with the correct path
import { jest, expect, beforeEach, test, describe } from "@jest/globals";
import GUN from 'gun'; // Import GUN to ensure the mock is used

jest.mock('gun'); // This uses the mock from __mocks__/gun.js if present

describe('GunDBAdaptor', () => {
    let gunDbAdaptor;
    let mockGun;

    beforeEach(() => {
        mockGun = GUN(); // Get the mocked instance
        gunDbAdaptor = new GunDBAdaptor();
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
            const mockUserData = { _:'#internal', name: 'John Doe', email: 'johndoe@example.com' };
            mockGun.get().get().once.mockImplementation(callback => {
                callback(mockUserData);
            });

            const result = await gunDbAdaptor.getUser(userId);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(userId);
            expect(mockGun.get().get().once).toHaveBeenCalled();
            expect(result).toEqual({ name: 'John Doe', email: 'johndoe@example.com' });
        });

        test('should return null when the user does not exist', async () => {
            const userId = 'user123';
            mockGun.get().get().once.mockImplementation(callback => {
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
            const followerData = { name: 'Jane Doe', email: 'janedoe@example.com' };

            gunDbAdaptor.addFollower(userId, followerId, followerData);

            expect(mockGun.get).toHaveBeenCalledWith('users');
            expect(mockGun.get().get).toHaveBeenCalledWith(followerId);
            expect(mockGun.get().get().put).toHaveBeenCalledWith(followerData);
            expect(mockGun.get().get().get).toHaveBeenCalledWith('followers');
            expect(mockGun.get().get().get().get).toHaveBeenCalledWith(followerId);
            expect(mockGun.get().get().get().get().set).toHaveBeenCalledWith(mockGun.get().get().put());
        });
    });
});
