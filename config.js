const { projectConfig } = require("./package.json");

module.exports = {
    mongoConfig: {
        connectionUrl: projectConfig.mongoConnectionUrl,
        database: "Tomo_db",
        collections: {
            USERS: "users",
        },
    },
    serverConfig: {
        ip: projectConfig.serverIp,
        port: projectConfig.serverPort,
    },
    tokenSecret: "Tomo_secret",
};
