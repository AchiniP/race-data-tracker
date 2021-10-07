import Cache from '../src/utils/Cache'

describe('Cache', () => {
    const attr1 = '111222333';
    const key = 'token';
    Cache.setInCache(key, attr1);

    it('Should retrieve token for key', () => {
        const tkn = Cache.retrieveFromCache(key);
        expect(tkn).toEqual(attr1);
    });

    it('Should return null for not available attribute', () => {
        const val = Cache.retrieveFromCache('country_code');
        expect(val).toEqual(null);
    });

    it('Should replace current value for key in cache', () => {
        const newToken = 222222
        Cache.setInCache(key, newToken);

        const val = Cache.retrieveFromCache(key);
        expect(val).toEqual(newToken);

    });
});
