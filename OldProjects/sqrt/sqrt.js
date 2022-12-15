function sqrt(n) {
    let acc = 100;
    let x = 1;
    let y;
    while (String(x).slice(0, acc) !== String(y).slice(0, acc)) {
        y = n / x;
        x = (x + y) / 2;
    }
    return (x);
}