let config = require("./webpack.config");
const Nodemon = require("nodemon-webpack-plugin");
config.plugins = [
    ...config.plugins,
    new Nodemon({
        args: ["../directory"]
    })
]

module.exports = config;