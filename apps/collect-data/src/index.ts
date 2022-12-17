import {
  writeList as oxford3k5k_writeList,
  addPhonsToList as oxford3k5k_addPhonsToList
} from './oxford-3k-5k'
import {writeList as voca_writeList} from './lets-go'

import {getDriver, readCSVFile, readJSONFile, writeCSVFile, writeJSONFile} from './utils'
import {parse} from "csv-parse";
import {toNum} from "licia";
import {lowerCase, orderBy, sortBy, take, takeRight, toNumber, trim} from "lodash";
const fs = require("fs");

main().catch(async err => {
  console.log(err)
  // await getDriver().quit()
})



async function main() {
  // const driver = getDriver(
  //   'firefox'
  // )
  // await driver.manage().window().maximize()
  // await driver.manage().setTimeouts({ implicit: 20000 })
  //
  // // await voca_writeList()
  //
  // // await oxford3k5k_writeList()
  // // await oxford3k5k_addPhonsToList()
  //
  // await driver.sleep(24*60*60*1e3)
  // await driver.quit()

  // 'enrich_your_ielts_vocabulary'



  // const data: any = await readCSVFile(`/raw/abc.csv`)
  //
  // const words = data.map((v: any) => {
  //   const item = v[0].split('@')
  //   return ({
  //     word: trim(item[0]),
  //     page: toNumber(item[1]),
  //   })
  // })
  //
  // const sortedWords = orderBy(words, w => lowerCase(w.word), ['asc'])
  //
  // console.log(takeRight(words, 5), takeRight(sortedWords, 5))
  //
  // await writeJSONFile('enrich_your_ielts_vocabulary', sortedWords)



  // let data = require("fs").readFileSync(process.cwd() + `/data/raw/abc.csv`, "utf8")
  // console.log(data[0])
  // await readJSONFile()

  // await writeCSVFile('raw/enrich_your_ielts_vocabulary', [
  //
  // ])
}
