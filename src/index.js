import 'dotenv/config';
import Logger from "./utils/Logger";
import InitService from './service/InitService';
import {closetDBConnection} from './repository/DBConnection';

const LOG = new Logger('index.js');

/**
 * Entry point
 * @returns {Promise<void>}
 */
const runWorker = async () => {
    LOG.info("Started the scheduler...")
    await InitService.runService().catch();
}

process.on('SIGINT',  () => {
    LOG.info('SIGTERM signal received.');
    LOG.warn('Closing http server.');
    closetDBConnection(() => {
        LOG.info('MongoDb connection closed.');
        process.exit(0);
    });
});

runWorker();

