const fetch = require('node-fetch')
const chalk = require('chalk')
const printCharacterBios = require('./print-character-bios')

const get = async function (url) {
  // force https
  const httpsUrl = url.replace('http://', 'https://')
  const response = await fetch(httpsUrl)
  const json     = await response.json()

  console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.status)

  return json
}

const fetchAllFromResource = async function (resource) {
  let page = await get(resource)
  let records = page.results

  while (page.next) {
    page = await get(page.next)
    records = [...records, ...page.results]
  }

  return records;
}

const main = async function () {
  try {
    const root = await get('https://swapi.co/api/')

    // fetch resources serially
    // const species = await fetchAllFromResource(root.species)
    // const characters = await fetchAllFromResource(root.people)
    // const planets = await fetchAllFromResource(root.planets)

    // or fetch them in parallel
    const [ characters, species, planets ] = await Promise.all([
      fetchAllFromResource(root.people),
      fetchAllFromResource(root.species),
      fetchAllFromResource(root.planets)
    ])

    printCharacterBios(characters, species, planets)
  } catch (error) {
    console.error(error)
  }
}

main()
