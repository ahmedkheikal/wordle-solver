const csv = require('csv-parser')
const fs = require('fs')

class Dataset {

    constructor(datasetPath) {
        this.datasetPath = datasetPath;
        this.filters = [];
        this.data = [];
    }

    async load() {
        await fs.createReadStream(this.datasetPath)
            .pipe(csv())
            .on('data', (row) => {
                this.data.push(row)
            })
            .on('end', () => {
                this.data = this.data.map(word => word.word)
                console.log('Data loaded')
            })
    }

    // evaluations: absent, correct, present
    addFilter(word, evaluations) {
        for (let letterIndex in word) {
            // duplicate letters one of them returns absent
            let existingAbsent = this.filters.filter((filter) => filter.letter === word[letterIndex] && filter.evaluation === 'absent');
            let existingPresent = this.filters.filter((filter) => filter.letter === word[letterIndex] && filter.evaluation === 'present');
            let existingCorrect = this.filters.filter((filter) => filter.letter === word[letterIndex] && filter.evaluation === 'correct');
            if (existingAbsent.length > 0) {
                this.filters[this.filters.findIndex(filter => filter.letter === word[letterIndex])] = {
                    position: letterIndex,
                    letter: word[letterIndex],
                    evaluation: evaluations[letterIndex]
                };
            } else if (existingCorrect.length > 0 && evaluations[letterIndex] === 'absent') {
                // do nothing
            } else if (existingPresent.length > 0 && evaluations[letterIndex] === 'absent') {
                // do nothing
            } else {
                this.filters.push({
                    position: letterIndex,
                    letter: word[letterIndex],
                    evaluation: evaluations[letterIndex]
                });
            }
        }
    }

    applyFilters() {
        for (let filter of this.filters) {
            if (filter.evaluation === 'absent') {
                this.applyAbsent(filter.letter)
            } else if (filter.evaluation === 'present') {
                this.applyPresent(filter.letter, filter)
            } else if (filter.evaluation === 'correct') {
                this.applyCorrect(filter.letter, filter)
            }
        }
    }

    applyAbsent(letter) {
        this.data = this.data.filter((word) => {
            let absent = true;
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) === letter) {
                    absent = false;
                }
            }
            return absent;
        })
    }

    applyCorrect(letter, filter) {
        this.data = this.data.filter((word) => {
            return word.charAt(filter.position) === letter;
        })
    }

    applyPresent(letter, filter) {
        this.data = this.data.filter((word) => {
            let exists = false;
            for (let letterPos in word) {
                if (word[letterPos] === letter) exists = true;
            }
            return word.charAt(filter.position) !== letter && exists;
        })
    }

    getRandomWord() {
        console.log(this.data.length)
        return this.data[Math.floor((Math.random() * this.data.length))];
    }
}

module.exports = Dataset;