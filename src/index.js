import mongoose from 'mongoose';
import 'dotenv/config';
import Logger from "./utils/Logger";
import ErrorBase from "./utils/ErrorBase";
import RaceApiRepository from './repository/RaceApiRepository';

const {DATABASE_URL} = process.env;

const LOG = new Logger('index.js');

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => {
    LOG.error(error);
    throw new ErrorBase("Failed to Connect to DB", 10001, 500);
});
db.once("open", () => LOG.info("connected to database..."));

/**
 * Entry point
 * @returns {Promise<void>}
 */
const runWorker = async () => {
    LOG.info("Started the scheduler...")
    await RaceApiRepository.fetchRaceData();
}

runWorker();

