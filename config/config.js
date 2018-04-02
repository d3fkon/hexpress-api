const env = process.env.NODE_ENV || 'development';

let config = {

}
const devConfig = require('./development');
switch (env) {
    case 'development': config = { ...config, ...devConfig }
}
module.exports = {
    config
}