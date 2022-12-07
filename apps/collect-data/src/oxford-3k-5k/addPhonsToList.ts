import {
  getDriver,
  getTextBySelector,
  matchCurrentUrl,
  readJSONFile,
  waitPageLoaded, writeCSVFile,
  writeJSONFile
} from "../utils";
import { By, Key } from 'selenium-webdriver'
import { replaceAll } from 'voca'
import { take } from 'lodash'
import { Word } from './writeList'

async function addPhonsToList() {
  const appUrl = `https://www.oxfordlearnersdictionaries.com`

  const driver = getDriver()

  await driver.get(appUrl)

  // const words: Word[] = take(readJSONFile('oxford3k5k'), 2)
  const words: Word[] = readJSONFile('oxford3k5k')

  for (const index in words) {
    // @ts-ignore
    const word = words[index]?.word

    await driver.findElement(By.id('q')).sendKeys(word, Key.RETURN)

    await waitPageLoaded()

    const isMatchUrl = await matchCurrentUrl(`${appUrl}/definition/`)

    if (isMatchUrl) {
      const pron_uk = await getTextBySelector('.phons_br > .phon')
      const pron_us = await getTextBySelector('.phons_n_am > .phon')

      words[index].pron_uk = 'Trương Thanh Tùng'
      words[index].pron_us = replaceAll(pron_us, '/', '')

      console.log(`Read - ${word}`);
    } else {
      console.log('Not OK', word)
    }
  }

  await writeJSONFile('oxford3k5k_phons', words)

  await writeCSVFile(
    'oxford3k5k_phons',
    words,
    {
      headers: [
        { field: 'sn', title: '#' },
        { field: 'word', title: 'Word' },
        { field: 'ox3000', title: 'Oxford 3000' },
        { field: 'ox5000', title: 'Oxford 5000' },
        { field: 'level', title: 'Level' },
        { field: 'pos', title: 'Part Of Speech' },
        { field: 'pron_uk', title: 'Pron UK' },
        { field: 'pron_us', title: 'Pron US' },
        { field: 'site_url', title: 'Site URL' },
      ]
    }
  )
}

export default addPhonsToList
