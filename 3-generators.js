const co = require('co');
const request = require('request-promise');
const chalk = require('chalk');
const printCharacterBios = require('./print-character-bios');

const getJSON = co.wrap(function* (url) {
  // force https
  const httpsUrl = url.replace('http://', 'https://');
  const response = yield request(httpsUrl, { resolveWithFullResponse: true });

  console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.statusCode);

  return JSON.parse(response.body);
});

const fetchAllFromResource = co.wrap(function* (resource) {
  let page = yield getJSON(resource);
  let records = page.results;

  while (page.next) {
    page = yield getJSON(page.next);
    records = [...records, ...page.results];
  }

  return records;
});

co(function* () {
  try {
    const rootResource = yield getJSON('https://swapi.co/api/');

    // fetch resources serially
    const characters = yield fetchAllFromResource(rootResource.people);
    const species    = yield fetchAllFromResource(rootResource.species);
    const planets    = yield fetchAllFromResource(rootResource.planets);

    // or fetch them in parallel
    // const [ characters, species, planets ] = yield Promise.all([
    //   fetchAllFromResource(root.people),
    //   fetchAllFromResource(root.species),
    //   fetchAllFromResource(root.planets)
    // ]);

    printCharacterBios(characters, species, planets);
  } catch (error) {
    console.error(error);
  }
});
