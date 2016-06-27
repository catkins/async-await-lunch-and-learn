const co = require('co')
const fetch = require('node-fetch')
const chalk = require('chalk')
const printCharacterBios = require('./print-character-bios')

const get = (url) => {
  // force https
  const httpsUrl = url.replace('http://', 'https://')

  return fetch(httpsUrl).then(response => {
    console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.status)
    return response.json()
  })
}

const fetchAllFromResource = (resource) => {
  return get(resource).then(page => {
    const fetchNextPage = (page, records) => {
      records = [...records, ...page.results]

      if (!page.next) {
        return records
      }

      return get(page.next).then(nextPage => fetchNextPage(nextPage, records))
    }

    return fetchNextPage(page, [])
  })

}

get('https://swapi.co/api/').then(root => {
  Promise.all([
    fetchAllFromResource(root.people),
    fetchAllFromResource(root.species),
    fetchAllFromResource(root.planets)
  ]).then(resolvedPromises => {
    const [ characters, species, planets ] = resolvedPromises
    printCharacterBios(characters, species, planets)

  })
})
