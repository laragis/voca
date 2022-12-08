import {
  error,
  getDriver,
  getTextBySelector, info,
  matchCurrentUrl,
  readJSONFile,
  waitPageLoaded, writeCSVFile,
  writeJSONFile
} from "../utils";
import { By, Key } from 'selenium-webdriver'
import { replaceAll } from 'voca'
import { take, takeRight, toNumber } from "lodash";
import { Word } from './writeList'

async function addPhonsToList() {
  const appUrl = `https://www.oxfordlearnersdictionaries.com`

  const driver = getDriver()

  await driver.get(appUrl)

  // const words: Word[] = take(readJSONFile('oxford3k5k'), 2)
  const words: Word[] = readJSONFile('oxford3k5k')

  info(`Reading Oxford 3k5k List`);

  for (const index in words) {
    // @ts-ignore
    const url = words[index]?.site_url
    const word = words[index]?.word

    await driver.sleep(2000)

    await driver.get(url)

    await waitPageLoaded()

    const isMatchUrl = await matchCurrentUrl(`${appUrl}/definition/`)

    if (isMatchUrl) {
      const pron_uk = await getTextBySelector('.phons_br > .phon')
      const pron_us = await getTextBySelector('.phons_n_am > .phon')

      words[index].pron_uk = replaceAll(pron_uk, '/', '')
      words[index].pron_us = replaceAll(pron_us, '/', '')

      console.log(`${toNumber(index)+1}. ${word}`);
    } else {
      error(`Not OK - ${toNumber(index)+1}. ${word}`)
    }
  }

  info(`End Oxford 3k5k List`);

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
