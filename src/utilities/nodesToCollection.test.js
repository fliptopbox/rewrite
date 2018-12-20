import nodesToCollection from "./nodesToCollection";

const node = (text = "", versions) => ({
    innerText: text,
    dataset: {
        versions
    }
});
test("nodes to collection", () => {
    const nodes = [
        node("Hello"),
        node("World", "World\n> Mundo\n> Planet")
    ];

    const check = nodesToCollection(nodes);

    expect(check).toHaveLength(2);
    expect(check[0].text).toBe("Hello");
    expect(check[0].versions).toBeUndefined();
    expect(check[1].text).toBe("World");
    expect(check[1].versions).toBe("World\n> Mundo\n> Planet");
})