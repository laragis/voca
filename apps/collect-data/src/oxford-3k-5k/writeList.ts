import axios from 'axios'
import $ from '../libs/jquery'
import { writeCSVFile, writeJSONFile } from '../utils'

export interface Word {
  sn?: number
  word: string
  ox3000: number
  ox5000: number
  level: string
  pos: string
  site_url: string
  pron_uk?: string
  pron_us?: string
}

async function writeList() {
  const resp = await axios.get(
    `https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000`
  )

  const html = $(resp.data)

  let sn = 1
  let words: Word[] = []

  html.find('.top-g > li').each(function (index) {
    const data = $(this).data()

    if (data.ox5000) {
      let
        pos = $(this).find('.pos').text(),
        site_url = `https://www.oxfordlearnersdictionaries.com` + $(this).find('a').attr('href')

      if(data.hw === 'yield' && pos === 'verb'){
        site_url = `https://www.oxfordlearnersdictionaries.com/definition/english/yield_2`
      }

      words.push({
        sn,
        word: data.hw,
        ox3000: data.ox3000 ? 1 : 0,
        ox5000: data.ox5000 ? 1 : 0,
        level: data.ox5000,
        pos,
        site_url
      })
      sn++
    }
  })

  await writeCSVFile(
    'oxford3k5k',
    words,
    {
      headers: [
        { field: 'sn', title: '#' },
        { field: 'word', title: 'Word' },
        { field: 'ox3000', title: 'Oxford 3000' },
        { field: 'ox5000', title: 'Oxford 5000' },
        { field: 'level', title: 'Level' },
        { field: 'pos', title: 'Part Of Speech' },
        { field: 'site_url', title: 'Site URL' }
      ]
    }
  )

  await writeJSONFile('oxford3k5k', words)
}

export default writeList;
