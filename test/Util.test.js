import ErrorBase from '../src/utils/error/ErrorBase';
import ErrorMessages from '../src/utils/error/ErrorMessages';
import ErrorCodes from '../src/utils/error/ErrorCodes';

describe('ErrorBase', () => {
  const Error = new ErrorBase(ErrorMessages.DB_WORKER_EXIT, ErrorCodes.DB_ERROR, 500);

  test('getErrorCode', () => {
    expect(Error.getErrorCode()).toBe(ErrorCodes.DB_ERROR);
  });

  test('getHttpStatusCode', () => {
    expect(Error.getHttpStatusCode()).toBe(500);
  });
});
