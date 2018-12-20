import extractCandidateText from "../modules/extractCandidateText";

function nodesToCollection(nodes) {
  return [...nodes].map(el => {
    const { innerText, dataset } = el;
    let text = (innerText && innerText.trim()) || null;
    let versions = (dataset && dataset.versions) || undefined;

    text = versions ? extractCandidateText(versions) : text || "";

    return Object.assign(
      {},
      {
        text,
        versions
      }
    );
  });
}

export default nodesToCollection;
