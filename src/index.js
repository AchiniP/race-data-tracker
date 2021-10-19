import 'dotenv/config';
import Logger from './utils/Logger';
import InitService from './service/InitService';
import {closetDBConnection} from './repository/DBConnection';

const LOG = new Logger('index.js');

/**
 * Entry point
 * @returns {Promise<void>}
 */
const runWorker = async (retryCount) => {
  LOG.info('Started the scheduler...')
  await InitService.runService().catch(async error => {
    LOG.error(`An Error occurred in Application: ${error}`);
    // ReInitiating
    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      await InitService.runService();
    }

  });
}

process.on('SIGINT', () => {
  LOG.info('SIGTERM signal received.');
  LOG.warn('Closing http server.');
  closetDBConnection(() => {
    LOG.info('MongoDb connection closed.');
    process.exit(0);
  });
});

runWorker();

