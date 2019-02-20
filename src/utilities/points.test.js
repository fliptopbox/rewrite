import points from './points';

test('pixel to point convertion', () => {
    expect(points()).toBeUndefined();
    expect(points('string')).toBeUndefined();

    expect(points(15)).not.toBe(12);
    expect(points(16)).toBe(12);
    expect(points(17)).not.toBe(12);
});
