function setup() {
    let primes = [2];
    const allLessThan = 1000000

    function generate() {
        for (let i = 2; i < allLessThan; i++) {
            let failed = false;
            for (let j = 0; j < primes.length; j++) {
                if (i % primes[j] === 0) {
                    failed = true;
                    break;
                }
            }
            if (!failed) {
                primes.push(i);
            }
        }
        console.log(primes);
    }
    generate();
}

//in j for loop additional requirement:  && primes[j] - 1 <= Math.sqrt(primes[primes.length-1])