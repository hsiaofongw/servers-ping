export class Random {

    /**
     * randomly select n items from population
     * @param population the population to sample from
     * @param n the sample size
     */
    static simpleRandomSampling<T>(population: T[], n: number): T[] {

        const nPop = population.length;
        if (n >= nPop) {
            return population;
        }

        const pickUpChancePerEach = n / nPop;
        let picked: T[] = [];
        let unPicked: T[] = [];
        for (const item of population) {
            const x = Math.random();
            if (x <= pickUpChancePerEach) {
                picked.push(item);
            }
            else {
                unPicked.push(item);
            }

            if (picked.length >= n) {
                return picked;
            }
        }

        return picked.concat(this.simpleRandomSampling(unPicked, n-picked.length));
    }

}