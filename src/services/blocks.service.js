const axios = require('axios').default;
const { host } = require('../config');

const getAuthtoken = async (email) => {
    const result = await axios.get(`${host.rooftop}/token?email=${email}`);
    return result.data.token;
}

class BlocksService{
    constructor(token){
        this.token = token;
        this.data = {};
        this.chunkSize = 0;
        this.length= 0;
        this.blocks=[];
        this.encoded='';
        console.log('instance of block service');
    }

    async saveBlocksData(){
        console.log('get blocks data init...');
        const result = await axios.get(`${host.rooftop}/blocks?token=${this.token}`);
        console.log('get blocks data finished');
        console.log(result.data);

        this.data = result.data.data;
        this.chunkSize = result.data.chunkSize;
        this.length = result.data.length;

        this.blocks[0] = this.data[0];
        this.auxBlocks = this.data;
        this.auxBlocks.shift();

        console.log(this.auxBlocks);
    }

    async generateEncode(){
        this.auxBlocks.forEach(async (element) => {
            const blockSave = this.blocks.concat(element);
            const result = await this.#verifyAdjacent(blockSave);
            result ? this.auxBlocks = this.auxBlocks.filter((item) => item !== element)  : null;
        });
    }

    async #verifyAdjacent(blocks){
        const result = await axios.post(`${host.rooftop}/check?token=${this.token}`, {
            blocks
        });
        console.log('test blocks: ');
        if(result.data.message){
            console.log(`Verified success, save blocks: `);
            this.blocks = blocks;
        } else {
            console.log(`Verified failed: `);
        }
        console.log(blocks);
        return result.data.message;
    }

    async encodeFinished(){
        console.log('encoded finished');
    }
}

module.exports = {
    getAuthtoken,
    BlocksService
}