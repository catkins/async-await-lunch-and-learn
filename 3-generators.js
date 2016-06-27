const co = require('co')
const fetch = require('node-fetch')
const chalk = require('chalk')
const printCharacterBios = require('./print-character-bios')

const get = co.wrap(function* (url) {
  // force https
  const httpsUrl = url.replace('http://', 'https://')
  const response = yield fetch(httpsUrl)
  const json     = yield response.json()

  console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.status)

  return json
})

const fetchAllFromResource = co.wrap(function* (resource) {
  let page = yield get(resource)
  let records = page.results

  while (page.next) {
    page = yield get(page.next)
    records = [...records, ...page.results]
  }

  return records;
})

co(function* () {
  try {
    const root = yield get('https://swapi.co/api/')

    // fetch resources serially
    // const species = yield fetchAllFromResource(root.species)
    // const characters = yield fetchAllFromResource(root.people)
    // const planets = yield fetchAllFromResource(root.planets)

    // or fetch them in parallel
    const [ characters, species, planets ] = yield Promise.all([
      fetchAllFromResource(root.people),
      fetchAllFromResource(root.species),
      fetchAllFromResource(root.planets)
    ])

    printCharacterBios(characters, species, planets)
  } catch (error) {
    console.error(error)
  }
})
