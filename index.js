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
    await wordle.writeWord('fucks');
    await wordle.getEvaluation(0)
    await wordle.writeWord('sucks')
    await wordle.writeWord('ducks')
    await wordle.writeWord('crews')


    await page.screenshot({path: 'example2.png'});

    await delay(3000);


    await browser.close();
}

main().then(r => console.log())