const path = require("path")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeJs API Project for Travelling App",
            version: "1.0.0",
            description: "API documentation for your Node.js application",
        },
        servers: [
            {
                // Where "Try it out" sends requests, so it has to be the URL the
                // browser can reach, not the container's internal address.
                url: process.env.SWAGGER_SERVER_URL
                    || `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
    },
    apis: [path.join(__dirname, "../routes/**/*.js")],
};

module.exports = options;