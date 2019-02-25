import markdown from './markdown';

test('markdown formating H1-6', () => {
    expect(markdown(' # text')).toEqual([]);
    expect(markdown('# text')).toEqual(['h1', 'text']);
    expect(markdown('## text')).toEqual(['h2', 'text']);
    expect(markdown('### text')).toEqual(['h3', 'text']);
    expect(markdown('#### text')).toEqual(['h4', 'text']);
    expect(markdown('##### text')).toEqual(['h5', 'text']);
    expect(markdown('###### text')).toEqual(['h6', 'text']);
    expect(markdown('####### text')).toEqual(['h6', 'text']);
});

test('markdown formating EM', () => {
    expect(markdown(' text')).toEqual([]);
    expect(markdown('*text')).toEqual([]);
    expect(markdown('_text')).toEqual([]);
    expect(markdown('text_')).toEqual([]);
    expect(markdown('_text_')).toEqual(['em', 'text']);
    expect(markdown('*text*')).toEqual(['em', 'text']);

    expect(markdown('_*text*_')).toEqual(['em', 'text']);
    expect(markdown('*_text_*')).toEqual(['em', 'text']);
});

test('markdown formating STRONG', () => {
    expect(markdown(' text')).toEqual([]);
    expect(markdown('*text')).toEqual([]);
    expect(markdown('*text')).toEqual([]);
    expect(markdown('text*')).toEqual([]);
    expect(markdown('__text**')).toEqual([]);
    expect(markdown('__text**')).toEqual([]);
    expect(markdown('__text__')).toEqual(['strong', 'text']);
    expect(markdown('**text**')).toEqual(['strong', 'text']);
});

test('markdown formating STRONG EM', () => {
    expect(markdown('_*text*_')).toEqual(['em', 'text']);
    expect(markdown('_*text*_')).toEqual(['em', 'text']);
    expect(markdown('*__text__*')).toEqual(['em', 'strong', 'text']);
    expect(markdown('**_text_**')).toEqual(['strong', 'em', 'text']);
});
