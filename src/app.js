const colors = require('colors');

// service
const BlocksService = require('./services/blocks.service');

const blocksService = new BlocksService();

const check = async () => {
    try {
       await blocksService.auth();
       await blocksService.saveData();
       await blocksService.decodeData();
    } catch (error) {
        console.error(colors.red('error check function'));
        console.error(error);
    }
}

check();