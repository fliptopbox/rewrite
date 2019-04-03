import getCandidateString from './getCandidateString';

test('Ensure commented lines are removed', () => {
    const fn = getCandidateString;
    expect(fn()).toBe('');
    expect(fn('> nothing')).toBe('');

    expect(fn('> nothing\nSomething')).toBe('');
    expect(fn(['> nothing', 'Something'])).toBe('Something');
    expect(
        fn(['> nothing', 'Something', '', '', '> nothing', 'Something'])
    ).toBe('Something Something');
});
