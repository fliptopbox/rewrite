function nodesToCollection(nodes) {
    return [...nodes].map(el => {
        const {
            innerText,
            dataset
        } = el;
        const text = (innerText && innerText.trim()) || "";
        const versions = (dataset && dataset.versions) || undefined;

        return Object.assign({}, {
            text,
            versions
        });
    });
}

export default nodesToCollection;