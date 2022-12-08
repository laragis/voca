import {
  writeList as oxford3k5k_writeList,
  addPhonsToList as oxford3k5k_addPhonsToList
} from './oxford-3k-5k'
import { writeList as voca_writeList } from './lets-go'

import { getDriver } from './utils'

main().catch(async err => {
  console.log(err)
  // await getDriver().quit()
})

async function main() {
  const driver = getDriver(
    'firefox'
  )
  await driver.manage().window().maximize()
  await driver.manage().setTimeouts({ implicit: 20000 })

  // await voca_writeList()

  // await oxford3k5k_writeList()
  await oxford3k5k_addPhonsToList()

  await driver.sleep(24*60*60*1e3)
  await driver.quit()
}
