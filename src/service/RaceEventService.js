import RaceEvent from "../model/RaceEvent";
import Logger from "../utils/Logger";

const LOG = new Logger('RaceEventService.js');

const buildRaceEvent = (raceData) => {
    LOG.debug("[SERVICE]: building race event to save in DB: ", raceData);
    const {event, horse, time} = raceData;
    const {id, name} = horse;
    return new RaceEvent({
        event,
        horse: {
            id,
            name
        },
        time
    })
}

export default {
    buildRaceEvent
}