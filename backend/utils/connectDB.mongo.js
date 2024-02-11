const mongoose =  require("mongoose");

async function connectToMongoDB(DB_URL) {
    try {
        await mongoose.connect(DB_URL);
        console.log('Mongoose connection successful');
    } catch (error) {
        console.log('Mongo error: ' + error.message);
        process.exit(1);
    }
}

module.exports = connectToMongoDB;