const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoMock;

/**
 * Before Each Test class Initialize MongoDB mock server
 */
beforeAll(async () => {
    mongoMock = await MongoMemoryServer.create();
    const mongoUri = mongoMock.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

/**
 * Before each test case delete all data
 */
beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
        const { collections } = mongoose.connection;
        const promises = Object.keys(collections)
            .map((collection) => mongoose.connection.collection(collection).deleteMany({}));
        await Promise.all(promises);
    }
});

/**
 * After Each test class close the connection
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoMock.stop();
});