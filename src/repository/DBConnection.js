import {connect, connection, set} from 'mongoose';
import {DB_CONNECTION} from "../utils/AppConstants";
import ErrorBase from '../utils/error/ErrorBase';
import ErrorMessages from '../utils/error/ErrorMessages';
import ErrorCodes from '../utils/error/ErrorCodes';
import {StatusCodes} from 'http-status-codes';
import Logger from '../utils/Logger';

const LOG = new Logger('DBConnection');
const {ENV} = process.env;
/**
 * Set Up Database Connection
 */
export const setUpDBConnection = () => {
  if (ENV !== 'production') {
    set('debug', true);
  }
  connect(DB_CONNECTION.url, DB_CONNECTION.options);
  const db = connection;
  db.on("error", error => {
    LOG.error(error);
    throw new ErrorBase(ErrorMessages.DB_CONNECTION_ERROR, ErrorCodes.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  });
  db.once("open", () => LOG.info("connected to database..."));
}

/**
 * Close Database Connection
 * @param callback
 */
export const closetDBConnection = (callback) => {
  connection.close(false, callback);
}
