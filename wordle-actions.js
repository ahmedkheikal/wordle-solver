const delay = require('./delay')

class WordleActions {
    constructor(page) {
        this.page = page
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
        console.log(rows[index]._letters, rows[index]._evaluation)
    }
}

module.exports = WordleActions