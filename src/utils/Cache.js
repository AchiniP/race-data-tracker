import cache from 'memory-cache';
import Logger from "./Logger";

const LOG = new Logger('Cache.js');
const timeoutCallback = 3600000; // set time out in one hour


/**
 * @description: Set value object in cache
 * */
const setInCache = (key, value) => {
    LOG.debug(`Storing value object in cache for key: ${key}`);
    cache.put(key, value, timeoutCallback);
};


/**
 * @description: Get value from in-memory cache
 * */
const retrieveFromCache = (key) => {
    return cache.get(key);

};

export default {
    setInCache,
    retrieveFromCache,
};