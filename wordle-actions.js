const delay = require('./delay')
const Dataset = require("./dataset");

class WordleActions {
    constructor(page) {
        this.success = false;
        this.dataset = new Dataset('./shared/valid_solutions.csv');
        this.page = page;
    }

    async writeWord(string) {
        for (let char in string) {
            await this.page.keyboard.press(string[char])
            await delay(500)
        }
        await this.page.keyboard.press('Enter')
        await delay(2000)
    }

    async getEvaluation(index) {
        let rows = await this.page.evaluate(() => document.querySelector('game-app').shadowRoot
            .querySelector('game-theme-manager')
            .querySelector('#game')
            .querySelectorAll('game-row'));
        this.success = rows[index]._evaluation.filter(evaluation => evaluation === 'correct').length === rows[index]._evaluation.length;
        this.dataset.addFilter(rows[index]._letters, rows[index]._evaluation)
        this.dataset.applyFilters();
    }
}

module.exports = WordleActions