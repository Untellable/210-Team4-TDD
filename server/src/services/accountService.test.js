import { accountLookupService } from "./accountService.js";
import FediverseAPIFactory from "../fediverse/fediverse-api-factory.js";

jest.mock("../db/dao.js");
jest.mock("../db/gun/gun-db-adapator.js");
jest.mock("../fediverse/fediverse-api-factory.js");

const EXISTENT_ACCOUNT = "thomasapowell@fosstodon.org";
const NONEXISTENT_ACCOUNT = "null@example.com";

describe("accountLookupService", () => {
    it("should return account data if account exists", async () => {
        const response = await accountLookupService(EXISTENT_ACCOUNT);
        console.log("Response:", response);
    });

    it("should return null if account does not exist", async () => {
        const response = await accountLookupService(NONEXISTENT_ACCOUNT);
        expect(response).toBeNull();
    });

    it("should throw error if account is not provided", async account => {
        await expect(accountLookupService()).rejects.toThrow();
    });
});