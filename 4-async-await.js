const request = require('request-promise');
const chalk = require('chalk');
const printCharacterBios = require('./print-character-bios');

async function getJSON(url) {
  const httpsUrl = url.replace('http://', 'https://');
  const response = await request(httpsUrl, { resolveWithFullResponse: true });

  console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.statusCode);

  return JSON.parse(response.body);
}

async function fetchAllFromResource(resource) {
  let page = await getJSON(resource);
  let records = page.results;

  while (page.next) {
    page = await getJSON(page.next);
    records = [...records, ...page.results];
  }

  return records;
}

async function main() {
  try {
    const rootResource = await getJSON('https://swapi.co/api/');

    // fetch resources serially
    const characters = await fetchAllFromResource(rootResource.people);
    const species    = await fetchAllFromResource(rootResource.species);
    const planets    = await fetchAllFromResource(rootResource.planets);

    // or fetch them in parallel
    // const [ characters, species, planets ] = await Promise.all([
    //   fetchAllFromResource(root.people),
    //   fetchAllFromResource(root.species),
    //   fetchAllFromResource(root.planets)
    // ])

    printCharacterBios(characters, species, planets);
  } catch (error) {
    console.error(error);
  }
}

main();
