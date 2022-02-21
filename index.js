const puppeteer = require('puppeteer');
const {logging} = require("selenium-webdriver");
const {write} = require("selenium-webdriver/io");
const WordleActions = require('./wordle-actions')
const delay = require('./delay')


async function main() {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto('https://www.nytimes.com/games/wordle/index.html', {
        waitUntil: 'networkidle2',
    });

    // await page.setViewport({ width: 800, height: 600 })


    await page.screenshot({path: 'example.png'});

    // await page.keyboard.press('Enter')
    await delay(3000);

    await page.mouse.click(132, 103, {button: 'left'})
    await page.mouse.click(132, 103, {button: 'left'})

    const wordle = new WordleActions(page)
    await wordle.dataset.load();
    await delay(1000)
    let int = 0;
    try {
        while (!wordle.success) {
            let word = wordle.dataset.getRandomWord();
            if (int === 0)
                await wordle.writeWord('irate');
            else
                await wordle.writeWord(word);
            await wordle.getEvaluation(int++)
        }
    } catch (exception) {
        main().then(r => console.log('failure retry'));
    }

    await page.screenshot({path: 'example2.png'});

    await delay(3000);


}

main().then(r => console.log())