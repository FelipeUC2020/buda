const dotenv = require('dotenv');
dotenv.config();  

const version = process.env.API_VERSION || 'v2';
const format = process.env.API_FORMAT || 'json';
const baseUrl = process.env.API_BASE_URL || 'https://www.buda.com/api';

function buildUrl(path) {
    const url = `${baseUrl}/${version}${path}.${format}`;
    // console.log(url);
    return url;
}

module.exports = buildUrl;