function points(pixels) {
    // https://everythingfonts.com/font/tools/units/px-to-pt
    if (!pixels || typeof pixels !== 'number') return;

    const pica = 0.75292857248934;
    let points = Math.round(pixels * pica);
    points = parseInt(points, 10);
    return points;
}

export default points;
