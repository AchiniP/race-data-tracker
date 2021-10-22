import sinon from 'sinon';
import axios from 'axios';
import RaceEventService from '../src/service/RaceEventService';
import Service from '../src/service/InitService';
import DBConnection from '../src/config/DBConnection';

/**
 * Test RaceEventService.fetchRaceData()
 */
describe('fetchRaceData', () => {
  let stub;
  beforeEach(() => {
    stub = sinon.stub(axios, 'request');
  });

  afterEach(() => {
    stub.restore();
  });

  it('check fetchRaceData success call', async () => {
    stub.onCall(0).returns(Promise.resolve(mockAuthTokenResponse()))
      .onCall(1).returns(Promise.resolve(mockEventResponse()));
    const spy = jest.spyOn(axios, 'request');  // spy on the method of the prototype
    await RaceEventService.fetchRaceData();
    expect(spy).toBeCalled();
  });

  it('check fetchRaceData failure call', async () => {
    stub.onCall(0).returns(Promise.resolve(mockAuthTokenResponse()))
      .onCall(1).returns(Promise.resolve(new Error('unexpected', 500)));
    const spy = jest.spyOn(axios, 'request');  // spy on the method of the prototype
    await RaceEventService.fetchRaceData();
    expect(spy).toBeCalled();
  });

});

/**
 * Test RaceEventService.fetchAuthToken()
 */
describe('fetchAuthToken', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(axios, 'request');
  });

  afterEach(() => {
    stub.restore();
  });

  it('check fetchAuthToken success call', async () => {
    stub.returns(Promise.resolve(mockAuthTokenResponse()));
    const spy = jest.spyOn(axios, 'request');  // spy on the method of the prototype
    await RaceEventService.fetchAuthToken();
    expect(spy).toBeCalled();
  });
});

/**
 * init service
 */
describe('init service', () => {
  let stub;
  let dbStub;
  beforeEach(() => {
    dbStub =  sinon.stub(DBConnection, 'setUpDBConnection');
    stub = sinon.stub(axios, 'request')
  });
  afterEach(() => {
    stub.restore();
    dbStub.restore();
  });

  it('should execute workers', async () => {
    dbStub.returns(Promise.resolve(true));
    stub.onCall(0).returns(Promise.resolve(mockAuthTokenResponse()))
      .onCall(1).returns(Promise.resolve(mockEventResponse()));
    const spy = jest.spyOn(Service, 'runService');
    await Service.runService();
    expect(spy).toBeCalled();
  });
});

const mockEventResponse = () => {
  return {
    status: 200,
    statusText: 'OK',
    data: {
      'event': 'finish',
      'horse': {
        'id': 3,
        'name': 'Soho'
      },
      'time': 18958
    }
  }
}

const mockAuthTokenResponse = () => {
  return  {
    status: 200,
    data: {
      token: '1111'
    }
  }
}

