import {Worker} from 'worker_threads';
import path from 'path';
import {STATUS_DB_CONNECT, STATUS_DB_SAVE, STATUS_RETRY_SERVICE, STATUS_START_SERVICE} from "../utils/AppConstants";
import Logger from "../utils/Logger";
import ErrorBase from "../utils/error/ErrorBase";
const LOG = new Logger('InitService.js');

const initWorkers = async () => {
    const dbWorker =  new Worker(path.resolve(__dirname, 'WorkerServiceConfig.js'), {
        workerData: {
            path: path.resolve(__dirname, 'DatabaseWorker.js')
        }
    });

    const apiWorker =  new Worker(path.resolve(__dirname, 'WorkerServiceConfig.js'), {
        workerData: {
            path: path.resolve(__dirname, 'APIWorker.js')
        }
    });

    LOG.info("Publishing message to connect to DB");
    dbWorker.postMessage({status: STATUS_DB_CONNECT});

    apiWorker.on("message", message => {
        const { status, data } = message

        if( status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
            apiWorker.postMessage({ status: STATUS_RETRY_SERVICE})
        }

        // Call database worker to save data
        if( status === STATUS_DB_SAVE) {
            dbWorker.postMessage({status: STATUS_DB_SAVE, data: data})
        }

    });

    /**
     * Listening on feedback messages from database worker
     */
    dbWorker.on("message", incoming => {
        const { status, data } = incoming

        // Call subscription worker after data has been saved by the save worker
        if( status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
            apiWorker.postMessage({ status: STATUS_RETRY_SERVICE})
        }

    })


    apiWorker.on("error", code => new Error(`Subscribe Worker error with exit code ${code}`));
    apiWorker.on("exit", code =>
        console.log(`Subscribe Worker stopped with exit code ${code}`)
    )



    dbWorker.on("error", code => new Error(`Save Worker error with exit code ${code}`));
    dbWorker.on("exit", code =>
        console.log(`Save Worker stopped with exit code ${code}`)
    )
}

const runService = async () => {
    await initWorkers();
}

export default {
    runService
}
