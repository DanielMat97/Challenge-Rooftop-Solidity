const BlocksService = require('../services/blocks.service');

jest.mock('../services/blocks.service');

const token = 'token_mock';

describe("Test block service", () => {
    const blocksService = new BlocksService();

    test("define type of BlockService", () => {
        expect(typeof blocksService).toBe("object");
        expect(typeof blocksService.auth).toBe("function");
        expect(typeof blocksService.saveData).toBe("function");
    });
})