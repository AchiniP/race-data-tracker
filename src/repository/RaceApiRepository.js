import 'dotenv/config';
import axios from "axios";
import Logger from "../utils/Logger";
import Cache from "../utils/Cache";
import ErrorBase from "../utils/error/ErrorBase";
import RaceEventService from "../service/RaceEventService";

const LOG = new Logger('RaceApiRepository.js');
const {EXTERNAL_API, ADMIN_USER_NAME, ADMIN_PASSWORD} = process.env

/**
 * @description Call 3rd party API to fetch Auth Token
 * @returns {Promise<void>}
 */
const fetchAuthToken = async () => {
    LOG.info('[REPOSITORY][RACE_API] Fetching Auth Token from Race API');
    const REQ_OBJ = {
        method: 'POST',
        url: `${EXTERNAL_API}/auth`,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            email: ADMIN_USER_NAME,
            password: ADMIN_PASSWORD
        }
    };
    const result = await axios(REQ_OBJ).then(resp => resp.data)
        .catch(async error => {
            LOG.error('[REPOSITORY][RACE_API] Error occurred when fetching auth token ' + error);
            if (error.response && error.response.status === 503) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await fetchAuthToken();
            }
            throw new ErrorBase('Error Occurred While Fetching AuthToken', 10002, error.response.status);
        });
    const {token} = result;
    Cache.setInCache('token', token);
}

/**
 * @description Call 3rd party API to fetch race data and save the fetched data to DB
 * @returns {Promise<void>}
 */
const fetchRaceData = async () => {
    LOG.info('[REPOSITORY][RACE_API] Fetching results from Race API');

    if (!Cache.retrieveFromCache('token')) {
        await fetchAuthToken();
    }

    const REQ_OBJ = {
        method: 'GET',
        url: `${EXTERNAL_API}/results`,
        headers: {
            Authorization: `Bearer ${Cache.retrieveFromCache('token')}`,
        }
    };
    return await axios(REQ_OBJ).then(resp => resp)
        .then(
            async response => {
                if (response.status === 200) {
                    const raceEvent = RaceEventService.buildRaceEvent(response.data);
                    LOG.info(`[REPOSITORY][RACE_API]: Going to Save: ${JSON.stringify(raceEvent)}`);
                    await raceEvent.save();
                }
                if (response.status === 204) {
                    LOG.info('[REPOSITORY][RACE_API]: No events to save');
                }
                await fetchRaceData();
            }
        ).catch(async error => {
            LOG.error(`[REPOSITORY][RACE_API] Error occurred when fetching results: ${error}`);
            if (error.response && error.response.status === 401) {
                await fetchAuthToken();
            }
            // retry
            await fetchRaceData();
        });
}

export default {
    fetchAuthToken,
    fetchRaceData
};
