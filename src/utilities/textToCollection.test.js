import textToCollection from './textToCollection';


test("text to collection", () => {

    let text = [
        "Do enim eiusmod ea laborum culpa commodo reprehenderit.",
        "Ullamco elit non dolor reprehenderit reprehenderit officia.",
        "",
        "Ex ex ea tempor incididunt duis sit."
    ];

    let result;

    result = textToCollection(text[0]);

    expect(result[0].key).toEqual(0);
    expect(result[0].id).not.toBeFalsy();
    expect(result[0].text).toEqual(text[0]);


    result = textToCollection(text.join("\n"));
    expect(result).toHaveLength(4);

    expect(result[0].key).toEqual(0);
    expect(result[0].id).not.toBeFalsy();
    expect(result[0].text).toEqual(text[0]);

    expect(result[1].key).toEqual(1);
    expect(result[1].id).not.toBeFalsy();
    expect(result[1].text).toEqual(text[1]);

    expect(result[2].key).toEqual(2);
    expect(result[2].id).toBeFalsy();
    expect(result[2].text).toBeFalsy();

    expect(result[3].key).toEqual(3);
    expect(result[3].id).not.toBeFalsy();
    expect(result[3].text).toEqual(text[3]);
});