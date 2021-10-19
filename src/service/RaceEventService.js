import axios from "axios";
import Logger from "../utils/Logger";
import { AUTH_REQ_OBJECT, FETCH_DATA_REQ_OBJ } from "../utils/AppConstants";

const LOG = new Logger('RaceEventService.js');
let TOKEN;

/**
 * Fetch Auth Token from external API
 */
const fetchAuthToken = async () => {
    await axios(AUTH_REQ_OBJECT).then(res => {
        const {data} = res;
        const {token} = data;
        TOKEN = token;
    }).catch(async error => {
        LOG.error('Error occurred when fetching auth token ' + error);
        await fetchAuthToken();
    });
};

/**
 * Fetch Race Data from external API
 */
const fetchRaceData = async () => {
    LOG.info('Fetching results from Race API');
    if (!TOKEN) {
        await fetchAuthToken();
    }
    return axios(FETCH_DATA_REQ_OBJ(TOKEN));
}

export default {
    fetchRaceData,
    fetchAuthToken,
}
