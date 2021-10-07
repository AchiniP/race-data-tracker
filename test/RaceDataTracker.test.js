import RaceEvent from '../src/model/RaceEvent';

describe('RaceEvent', () => {
    it('should add RaceEvent document to mocked collection', async () => {

        const mockedData = mockEvent();
        await RaceEvent.create(mockedData);
        const insertedRace = await RaceEvent.findOne({ event: "finish" });
        expect(insertedRace.event).toEqual(mockedData.event);
        expect(insertedRace.time).toEqual(mockedData.time);
        expect(insertedRace.horse.id).toEqual(mockedData.horse.id);
        expect(insertedRace.horse.name).toEqual(mockedData.horse.name);
    });

    it('should able to fetch data by horseId', async () => {

        const mockedData = mockEvent();
        await RaceEvent.create(mockedData);
        const insertedRace = await RaceEvent.findOne({ "horse.id": 3 });
        expect(insertedRace.event).toEqual(mockedData.event);
        expect(insertedRace.time).toEqual(mockedData.time);
        expect(insertedRace.horse.id).toEqual(mockedData.horse.id);
        expect(insertedRace.horse.name).toEqual(mockedData.horse.name);
    });
});

const mockEvent = () => {
    return {
        "event": "finish",
        "horse": {
            "id": 3,
            "name": "Soho"
        },
        "time": 18958
    }
}
