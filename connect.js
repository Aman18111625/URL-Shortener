const mongoose = require("mongoose");

async function connectToDatabase(url = process.env.MONGODB_URI) {
    if (!url) {
        throw new Error("MONGODB_URI is not defined");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    await mongoose.connect(url);
    return mongoose.connection;
}

module.exports = {
    connectToDatabase,
};