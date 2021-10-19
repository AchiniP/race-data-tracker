import {Worker} from 'worker_threads';
import {StatusCodes} from 'http-status-codes';
import path from 'path';
import {STATUS_DB_CONNECT, STATUS_DB_SAVE, STATUS_RETRY_SERVICE, STATUS_START_SERVICE} from '../utils/AppConstants';
import Logger from '../utils/Logger';
import ErrorBase from '../utils/error/ErrorBase';
import ErrorMessages from '../utils/error/ErrorMessages';
import ErrorCodes from '../utils/error/ErrorCodes';

const LOG = new Logger('InitService.js');

const initWorkers = async () => {
  /**
     * Initialize worker for database related work
     * @type {module:worker_threads.Worker}
     */
  const dbWorker = new Worker(path.resolve(__dirname, 'WorkerServiceConfig.js'), {
    workerData: {
      path: path.resolve(__dirname, 'DatabaseWorker.js')
    }
  });

  /**
     * Initialize worker for data fetching
     * @type {module:worker_threads.Worker}
     */
  const apiWorker = new Worker(path.resolve(__dirname, 'WorkerServiceConfig.js'), {
    workerData: {
      path: path.resolve(__dirname, 'APIWorker.js')
    }
  });

  LOG.info('Publishing message to connect to DB');
  dbWorker.postMessage({status: STATUS_DB_CONNECT});

  /**
     * api worker listeners
     */
  apiWorker.on('message', message => {
    const {status, data} = message

    if (status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
      LOG.debug('Publishing message to fetch data');
      apiWorker.postMessage({status: STATUS_RETRY_SERVICE})
    }

    if (status === STATUS_DB_SAVE) {
      LOG.debug('Publishing message to save data');
      dbWorker.postMessage({status: STATUS_DB_SAVE, data: data})
    }

  });

  /**
     * db worker listener
     */
  dbWorker.on('message', message => {
    const {status, data} = message

    if (status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
      LOG.debug('Publishing message to fetch data');
      apiWorker.postMessage({status: STATUS_RETRY_SERVICE})
    }

    if (status === STATUS_DB_SAVE) {
      LOG.debug('Publishing message to save data');
      dbWorker.postMessage({status: STATUS_DB_SAVE, data: data})
    }

  })

  /**
     * Handle API worker errors
     */
  apiWorker.on('error', code => {
    LOG.error(`Error occurred in API worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.API_WORKER_ERROR, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
  apiWorker.on('exit', code => {
    LOG.warn(`Going to Exiting API worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.API_WORKER_EXIT, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });


  /**
     * Handle Database worker errors
     */
  dbWorker.on('error', code => {
    LOG.error(`Error occurred in Database worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.DB_WORKER_ERROR, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
  dbWorker.on('exit', code => {
    LOG.warn(`Going to Exiting Database worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.DB_WORKER_EXIT, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
}

/**
 * Initialize workers
 * @returns {Promise<void>}
 */
const runService = async () => {
  await initWorkers();
}

export default {
  runService
}
