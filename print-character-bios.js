const chalk = require('chalk')

// takes array and returns hash keyed by property
// basically lodash/indexBy
const indexBy = (array, property) => array.reduce((hash, item) => {
  const key = item[property]
  hash[key] = item
  return hash
}, {})

module.exports = (characters, species, planets) => {
  // lookup tables of species and planets
  const speciesByUrl = indexBy(species, 'url')
  const planetsByUrl = indexBy(planets, 'url')

  // print out the character info (backwards to show most famous at bottom)
  characters.reverse().forEach(character => {
    console.log(chalk.yellow('name:'), character.name)
    console.log(chalk.blue('url:'), character.url)
    console.log(chalk.blue('mass:'), character.mass)
    console.log(chalk.blue('height:'), character.mass)
    console.log(chalk.blue('birth year:'), character.birth_year)

    character.species.forEach(speciesUrl => {
      const species = speciesByUrl[speciesUrl]
      console.log(chalk.blue('species:'), species.name, species.url)
    })

    const homeworld = planetsByUrl[character.homeworld]
    if (homeworld) {
      console.log(chalk.blue('homeworld:'), homeworld.name, homeworld.url)
    }

    console.log('-------------')
  })

}
