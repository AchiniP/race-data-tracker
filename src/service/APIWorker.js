import {parentPort} from 'worker_threads';
import {StatusCodes} from 'http-status-codes';
import RaceEventService from './RaceEventService';
import {STATUS_START_SERVICE, STATUS_RETRY_SERVICE, STATUS_DB_SAVE} from '../utils/AppConstants';
import Logger from '../utils/Logger';

const LOG = new Logger('APIWorker');

/**
 * Subscribe to messages from Parent
 */
parentPort.on('message', message => {
  const {status} = message;
  if (status === STATUS_START_SERVICE || status === STATUS_RETRY_SERVICE) {
    runAPIWorker()
  }
})

/**
 * fetch race event data through worker
 * @returns {Promise<void>}
 */
const runAPIWorker = async () => {
  LOG.info('run API worker')
  await RaceEventService.fetchRaceData().then(
    resonse => handleResponse(resonse)
  ).catch(err => handleError(err));
}

/**
 * handler for success response from result api
 * @param response
 * @returns {Promise<void>}
 */
const handleResponse = async (response) => {
  if (response.status === StatusCodes.OK) {
    LOG.info('Publishing for Save RaceEvent');
    let {data} = await response
    parentPort.postMessage({status: STATUS_DB_SAVE, data: data})
  } else {
    LOG.info(`Response Status Received is ${response.status}. Publishing for retry`);
    parentPort.postMessage({status: STATUS_RETRY_SERVICE})
  }
}

/**
 * handler for error response
 * @param error
 * @returns {Promise<void>}
 */
const handleError = async (error) => {
  LOG.error(`Error occurred when fetching results: ${error}`);
  if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
    await RaceEventService.fetchAuthToken();
  }
  LOG.info('Publishing for retry on error');
  parentPort.postMessage({status: STATUS_RETRY_SERVICE});
}
