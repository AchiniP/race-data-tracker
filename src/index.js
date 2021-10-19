import 'dotenv/config';
import Logger from './utils/Logger';
import InitService from './service/InitService';
import {closetDBConnection} from './repository/DBConnection';

const LOG = new Logger('index.js');
const { MAX_RETRY } = process.env;
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
  LOG.info('SIGINT signal received.');
  LOG.warn('Closing http server.');
  closetDBConnection(() => {
    LOG.info('MongoDb connection closed.');
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  LOG.error('Unexpected Error occurred in Application. Exit App!', err)
  process.exit(1) //mandatory (as per the Node.js docs)
})

runWorker(MAX_RETRY);

