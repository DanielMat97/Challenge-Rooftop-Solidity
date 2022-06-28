// emial
const { email } = require('../src/config');

// service
const { getAuthtoken, BlocksService } = require('./services/blocks.service');

const check = async () => {
    try {
        console.log(`email get token: ${email}`);
        const token = await getAuthtoken(email);
        const blocksService = new BlocksService(token);
        await blocksService.saveBlocksData();
        await blocksService.generateEncode();
    } catch (error) {
        console.log('error encoding blocks');
        if(error && error.response && error.response.status == 429){
            console.log('too many requests');
        } else {
            console.log(error);
        }
    }
}

check();