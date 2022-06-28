const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../../.env')
});
module.exports = {
    email: process.env.EMAIL,
    host: {
        rooftop: process.env.HOST_ROOFTOP
    }
};