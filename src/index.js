import 'dotenv/config';
import Logger from './utils/Logger';
import InitService from './service/InitService';
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

/**
 * Gracefully handle SIGINT
 */
process.on('SIGINT', () => {
  LOG.info('SIGINT signal received. Exit App!');
  process.exit(1);
});

/**
 * Gracefully handle uncaught exceptions
 */
process.on('uncaughtException', err => {
  LOG.error(`Unexpected Error occurred in Application. Exit App! Error: ${err}`);
  process.exit(1)
})

runWorker(MAX_RETRY);

