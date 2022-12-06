import {By, until, Builder} from 'selenium-webdriver'
import {visitOxford3k5kPage} from './oxford-3k-5k'
import chrome, {ServiceBuilder} from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox'
import config from './config'

main().catch(err => {

})

async function main() {
  const driver = await getDriver()

  await driver.get('http://www.google.com/ncr');

  // await driver.quit();

  // console.log(123)
  // try {
  //   // const driver = getDriver()
  //   let driver = await new Builder().forBrowser("chrome").build();
  //
  // } catch (err) {
  //   console.log(err)
  // }
}

function getDriver(browser = 'chrome') {
  let driver = new Builder()

  if(browser === 'chrome'){
    driver = driver.forBrowser(browser)
    driver = driver.setChromeOptions(getChromeOptions())
  }

  return driver.build();
}

function getChromeOptions(){
  const chromeOptions = new chrome.Options();

  // chromeOptions.addArguments('--no-sandbox')
  // chromeOptions.addArguments('--disable-dev-shm-usage')
  // chromeOptions.addArguments(`user-data-dir=${config.chrome.userDataDir}`)
  // chromeOptions.addArguments(`profile-email=${config.chrome.profileEmail}`)
  // chromeOptions.addArguments("start-maximized")

  return chromeOptions
}


