import {
  writeList as oxford3k5k_writeList,
  addPhonsToList as oxford3k5k_addPhonsToList,
} from './oxford-3k-5k'
import { getDriver } from "./utils";

main().catch(err => {
  console.log(err)
})

async function main() {
  const driver = getDriver()
  await driver.manage().window().maximize();
  await driver.manage().setTimeouts( { implicit: 20000 } );

  // await oxford3k5k_writeList()
  await oxford3k5k_addPhonsToList()
  await driver.quit()
}
