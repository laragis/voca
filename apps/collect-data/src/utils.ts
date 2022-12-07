import { Builder, By, Locator, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import fs from 'fs'
import { createObjectCsvWriter } from 'csv-writer'
import { isString, map } from 'lodash'

let driver: any = null

export function getDriver(browser = 'chrome') {
  if (driver) return driver

  driver = new Builder()

  if (browser === 'chrome') {
    driver.forBrowser(browser)
    driver.setChromeOptions(getChromeOptions())
  }

  driver = driver.build()

  return driver
}

function getChromeOptions() {
  const chromeOptions = new chrome.Options()

  chromeOptions.addArguments('--no-sandbox')
  chromeOptions.addArguments('--disable-dev-shm-usage')
  // chromeOptions.addArguments(`user-data-dir=${config.chrome.userDataDir}`)
  // chromeOptions.addArguments(`profile-email=${config.chrome.profileEmail}`)
  chromeOptions.addArguments('start-maximized')

  return chromeOptions
}

export const waitElement = (locator: Locator, delay = 20000) =>
  getDriver().findElement(async () => {
    await getDriver().wait(until.elementLocated(locator), delay)
    return getDriver().findElement(locator)
  })

export async function waitPageLoaded(delay?: number, shouldStopTime?: number) {
  let serial = 1

  let shouldStop = false
  setTimeout(() => {
    shouldStop = true
  }, shouldStopTime || 12000)

  await new Promise(resolve => {
    const timer = setInterval(async () => {
      const message = await getDriver().executeScript(
        'return document.readyState'
      )

      if (message === 'complete') {
        clearInterval(timer)
        // console.log(`Page state - ${message}`)
        resolve(true)
        return
      }

      if (shouldStop) {
        clearInterval(timer)
        console.log(`Page state - ${message} - ${serial}`)
        resolve(false)
        return
      }

      console.log(`Continue checking page state - ${message} - ${serial}`)

      serial++
    }, delay || 1000)
  })
}

export const matchCurrentUrl = async (url: string) => {
  const currentUrl = await getDriver().getCurrentUrl()
  return currentUrl && currentUrl.includes(url)
}

export const getTextBySelector = async (selector: string) => {
  const el = await getDriver().findElement(By.css(selector))
  return await el.getText()
}

export const writeJSONFile = async (fileName: string, data: object) => {
  fs.writeFileSync(
    process.cwd() + `/data/${fileName}.json`,
    JSON.stringify(data, null, 2)
  )
  console.log(`Data written to file ${fileName}.json`)
}

export const readJSONFile = (fileName: string) => {
  const data: any = fs.readFileSync(process.cwd() + `/data/${fileName}.json`)
  return JSON.parse(data)
}

interface Options {
  headers: object | string[]
}

export const writeCSVFile = async (
  fileName: string,
  data: object[],
  options?: Options
) => {
  const headers: any = map(options?.headers, (h: any, k) => {
    return isString(h) ? h : { id: h.field, title: h.title ?? h.field }
  })

  const csvWriter = createObjectCsvWriter({
    path: process.cwd() + `/data/${fileName}.csv`,
    header: headers,
    ...options
  })

  await csvWriter.writeRecords(data)

  console.log(`Data written to file ${fileName}.csv`)
}


