import elapsed from './elapsed';

let lastmodified, currentdate;

test('elapsed time expressed as phrases', () => {
    // error arguments aka NOT dates
    expect(elapsed()).toBeNull();
    expect(elapsed('asdf')).toBeNull();
    expect(elapsed(0)).not.toBeNull();
    expect(elapsed(0, 'asdf')).toBeNull();

    // alt date value
    expect(elapsed(Number('1550522297418'))).not.toBeNull();
    expect(elapsed('1550522297418')).not.toBeNull();

    // Thu Jan 01 1970 01:00:00 GMT+0100 (Greenwich Mean Time)
    lastmodified = new Date(1970, 0, 1, 1, 0, 0);
    currentdate = new Date(1970, 0, 1, 1, 0, 0);

    currentdate = new Date(1000 * 5);
    expect(elapsed(lastmodified, currentdate)).toBe('Now');

    currentdate = new Date(1000 * 30);
    expect(elapsed(lastmodified, currentdate)).toBe('30 seconds ago');

    currentdate = new Date(1000 * 45);
    expect(elapsed(lastmodified, currentdate)).toBe('45 seconds ago');

    currentdate = new Date(1000 * 60);
    expect(elapsed(lastmodified, currentdate)).toBe('A minute ago');

    currentdate = new Date(1000 * 60 * 12);
    expect(elapsed(lastmodified, currentdate)).toBe('12 minutes ago');

    currentdate = new Date(1000 * 60 * 60 * 1);
    expect(elapsed(lastmodified, currentdate)).toBe('An hour ago');

    currentdate = new Date(1000 * 60 * 60 * 2);
    expect(elapsed(lastmodified, currentdate)).toBe('2 hours ago');

    currentdate = new Date(1000 * 60 * 60 * 6);
    expect(elapsed(lastmodified, currentdate)).toBe('6 hours ago');

    currentdate = new Date(1000 * 60 * 60 * 12);
    expect(elapsed(lastmodified, currentdate)).toBe('At 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24);
    expect(elapsed(lastmodified, currentdate)).toBe('Yesterday at 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24 * 2);
    expect(elapsed(lastmodified, currentdate)).toBe('Thu at 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24 * 7);
    expect(elapsed(lastmodified, currentdate)).toBe('Last Thu at 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24 * 7 * 2);
    expect(elapsed(lastmodified, currentdate)).toBe('Thu 1 Jan at 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24 * 7 * 52);
    expect(elapsed(lastmodified, currentdate)).toBe('1 Jan 1970 01:00');

    currentdate = new Date(1000 * 60 * 60 * 24 * 7 * 52 * 2);
    expect(elapsed(lastmodified, currentdate)).toBe('1 Jan 1970 01:00');
});
