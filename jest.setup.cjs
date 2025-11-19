require('reflect-metadata');

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid'),
}));

jest.mock('query-string', () => ({
    parse: jest.fn((str, options) => {
        if (!str) return {};
        return Object.fromEntries(new URLSearchParams(str));
    }),

    stringify: jest.fn((obj, options) => {
        if (!obj) return '';
        return new URLSearchParams(obj).toString();
    }),

    extract: jest.fn((str) => str),
    parseUrl: jest.fn((url, options) => ({
        url: url.split('?')[0],
        query: {},
    })),
    stringifyUrl: jest.fn((obj, options) => obj.url),
    pick: jest.fn((str, keys) => str),
    exclude: jest.fn((str, keys) => str),
}));
