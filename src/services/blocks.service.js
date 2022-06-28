const axios = require('axios').default;
const { host, email } = require('../config');
const colors = require('colors');

class BlocksService {
    constructor() {
        this.token = '';
        this.data = [];
        this.chunkSize = 0;
        this.length = 0;
        this.blocks = [];
        this.auxBlocks = [];
        this.complete = false;
    }

    async auth() {
        console.log(colors.yellow('getting token...'));

        const response = await axios(`${host.rooftop}/token`, {
            params: {
                email
            }
        });
        this.token = response.data.token;

        console.log(colors.green('get token success with email: ' + email + ' token: ' + this.token));
    }

    async saveData() {
        console.log(colors.yellow('saving data blocks...'));

        const response = await axios.get(`${host.rooftop}/blocks`, {
            params: {
                token: this.token
            }
        });
        this.data = response.data.data;
        this.chunkSize = response.data.chunkSize;
        this.length = response.data.length;
        this.blocks.push(this.data[0]);
        this.auxBlocks = this.data;
        this.auxBlocks.shift();

        console.log(colors.green('get data success'));
        console.table(this.data);
    }

    async decodeData() {
        console.log('Reporded: ');
        console.log('mining blocks: ');
        console.table(this.blocks);

        const promises = []

        this.auxBlocks.forEach(block => {
            const testBlock = this.blocks.concat(block);
            promises.push(this.#verifyAdjacent(testBlock));
        });

        console.log(`posibiliets: ${promises.length}`);
        console.log(`testing...`);

        const result = await Promise.all(promises);

        result.forEach((test, idx) => {
            if(!this.complete && test.data.message ){
                this.auxBlocks.splice(idx, 1);
                this.blocks.push(JSON.parse(test.config.data).blocks.pop());
                this.complete = this.data.length == this.blocks.length;

                console.log(`blocks mining: ${this.blocks.length} of ${this.data.length}`);
                console.log('test success block: ');
                console.table(JSON.parse(test.config.data).blocks);
            }
        });

        console.log(`blocks encoded: ${this.blocks.length}`);


        if(this.complete || promises.length <= 0){
            const result = await this.#verifyEncode();

            if(result){
                console.log(colors.green('************************* Decode Success *************************'));
            } else {
                console.log(colors.red('************************* Decode Error *************************'));
            }

            console.table(this.blocks);
        } else {
            await this.decodeData();
        }
     }

    async #verifyAdjacent(blocks) {
        console.log('test block...');

        const result = await axios.post(`${host.rooftop}/check?token=${this.token}`, {
            blocks: [
                blocks[blocks.length - 2],
                blocks[blocks.length - 1]
            ]
        });
        return result;
    }

    async #verifyEncode(){
        console.log('test encode...');

        const result = await axios.post(`${host.rooftop}/check?token=${this.token}`, {
            encoded: this.blocks.join("")
        });

        console.log(colors.yellow(`result: ${result.data.message}`));
        return result.data.message;
    }
}

module.exports = BlocksService;