import { getDriver, info, parseHTML, sleep, waitClick } from "../utils";
import { By, Key, until, WebElement } from 'selenium-webdriver'
import { range, trim } from 'lodash'
import chalk from 'chalk'

async function writeList(name = 'lets_go') {
  const courses: any = {
    lets_go: 'https://www.voca.vn/hoc-tu-vung-tieng-anh-mien-phi'
  }

  const driver = getDriver()

  await driver.get('https://www.voca.vn/library/vocabulary')

  await step1_filter(7412, 7411)
  // await step2_learning(7412, 7411)
  // await step3_test(7412, 7411)

  // 7414-7411: topic-parent
  // https://www.voca.vn/filter/7412-7411
  // https://www.voca.vn/show-filter-chart/7412-7411 -> button-learning-now

  // https://www.voca.vn/show-filter-chart/96-95
  // https://www.voca.vn/learning/96-95
  // https://www.voca.vn/test/96-95
}

async function step1_filter(topic: number, parent: number) {
  const driver = getDriver()
  const url = `https://www.voca.vn/filter/${topic}-${parent}`
  info(`Open the filter: ${url}`)
  await driver.get(url)

  await learning_word()
  info(`Finished the filter: ${url}`)
}

async function step2_learning(topic: number, parent: number) {
  const driver = getDriver()

  // `https://www.voca.vn/learning/7412-7411`
  const url = `https://www.voca.vn/learning/${topic}-${parent}`
  await driver.get(url)
  console.log(`Open learning: ${url}`)

  await learning_word()
}

async function step3_test(topic: number, parent: number) {
  const driver = getDriver()
  // `https://www.voca.vn/test/7412-7411`
  const url = `https://www.voca.vn/test/${topic}-${parent}`
  await driver.get(url)
  info(`Start the test: ${url}`)

  await driver.findElement(By.css('.btn-ready')).click()

  const elExs: WebElement[] = await driver.findElements(
    By.css('.testing-body-cover .testing-exercise')
  )

  let index = 0,
    serial = 1
  for (const elEx of elExs) {
    await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,"exercise-current") and @index="${index}"]`)), 10000)

    const type = await elEx.getAttribute('type')
    const typeQuestion = await elEx.getAttribute('typequestion')
    const title = await elEx
      .findElement(By.css('.testing-exercise-title'))
      .getAttribute('innerHTML')

    console.log(`${serial}. Question: ${title}`)

    if (typeQuestion === 'guessing') {
      // 1. Ch???n t??? ????ng v???i phi??n ??m sau
      // 2. Ch???n ngh??a ????ng v???i t??? v???ng sau
      // 3. Ch???n t??? ph?? h???p theo c??c g???i ?? sau
      // 4. Ch???n t??? ????ng v???i ?????nh ngh??a sau
      // 5. Ch???n t??? ????ng v???i ??m thanh sau
      // 5. Nghe v?? ch???n phi??n ??m ????ng
      // 5. Ch???n ngh??a ????ng v???i ??m thanh sau
      // 6. Ch???n c??u d???ch ti???ng Vi???t ph?? h???p nh???t v???i c??u ti???ng Anh sau
      // 6. Ch???n c??u ti???ng Anh ph?? h???p nh???t v???i c??u ti???ng Vi???t sau

      if (
        title.includes('Ch???n ngh??a ????ng v???i t??? v???ng') ||
        title.includes('Ch???n ngh??a ????ng v???i ??m thanh')
      ) {
        const answerText = trim(
          await elEx
            .findElement(By.css('.result-content-definition-vi'))
            .getAttribute('innerText')
        )
        await solveQuestion(elEx, serial, answerText)
      } else if (title.includes('Nghe v?? ch???n phi??n ??m ????ng')) {
        const answerText = trim(
          await elEx
            .findElement(By.css('.result-content-phonetic > span'))
            .getAttribute('innerText')
        )
        await solveQuestion(elEx, serial, answerText)
      } else if (
        title.includes(
          'Ch???n c??u d???ch ti???ng Vi???t ph?? h???p nh???t v???i c??u ti???ng Anh'
        )
      ) {
        const answerText = trim(
          await elEx
            .findElement(By.css('.result-content-definition-vi'))
            .getAttribute('innerText')
        )
        await solveQuestion(elEx, serial, answerText, true)
      } else {
        // title.includes('Ch???n t??? ????ng v???i phi??n ??m') ||
        // title.includes('Ch???n t??? ph?? h???p theo c??c g???i ??') ||
        // title.includes('Ch???n t??? ????ng v???i ?????nh ngh??a') ||
        // title.includes('Ch???n t??? ????ng v???i ??m thanh') ||
        // title.includes('Ch???n c??u ti???ng Anh ph?? h???p nh???t v???i c??u ti???ng Vi???t')

        const answer = await elEx
          .findElement(By.css('.result-content-text-main'))
          .getAttribute('innerHTML')
        const answerText = trim(getAnswerText(answer))
        await solveQuestion(elEx, serial, answerText)
      }
    }

    if (typeQuestion === 'writing') {
      const answer = await elEx
        .findElement(By.css('.result-content-text-main'))
        .getAttribute('innerHTML')
      const answerText = trim(getAnswerText(answer))
      await elEx
        .findElement(By.css('input.answer-writing'))
        .sendKeys(answerText, Key.RETURN)
      console.log(`${serial}. Answer: ${answerText}`)
    }

    index++
    serial++
  }

  info(`Finished the test: ${url}`)
}

async function learning_word() {
  const driver = getDriver()

  const elLayers = await driver.findElements(By.css('.layer:not(.item-last)'))

  for (const index of range(elLayers.length)) {
    const elLayer = await elLayers[index]

    console.log(`${index + 1}. Question`)

    await driver.wait(async () => {
      const classNames = await elLayer.getAttribute('class') || ''
      return classNames.includes('exercise-current')
    },
      500e3, 'Answer wrong'
    )

    const answer = await elLayer.getAttribute('words')
    await elLayer
      .findElement(By.css('.learning-fill-word'))
      .sendKeys(answer, Key.RETURN)

    console.log(`${index + 1}. Answer: ${answer}`)

    await driver.sleep(1000)
    await driver.findElement(By.css('.button-next')).click()
  }
}

async function solveQuestion(
  elEx: any,
  serial: number,
  answerText: string,
  skip = false
) {
  const driver = getDriver()

  const guessItems = await elEx.findElements(By.css('.answer-guessing'))

  const apbs = ['a', 'b', 'c', 'd']
  let choosen = '',
    index = 0

  for (const guessItem of guessItems) {
    const guessEl = await guessItem.findElement(By.css('.guessing-text'))
    let guessText = await guessEl.getAttribute('innerText')
    let hideAnswer = await guessItem.getAttribute('hideanswer')
    if (hideAnswer) guessText = hideAnswer

    if (guessText.includes(answerText)) {
      choosen = guessText
      console.log(`${serial}. Answer: ${apbs[index]} - ${answerText}`)
      await waitClick(guessItem)
    }

    index++
  }

  if (skip && !choosen) {
    await waitClick(guessItems[0])
    console.log(`${serial}. ${chalk.red(`Skip: ${answerText}`)}`)
  }
}

function getAnswerText(answerStr: string) {
  const $ = parseHTML(answerStr)
  $('span').remove()
  return $('body').text().trim()
}

export default writeList
