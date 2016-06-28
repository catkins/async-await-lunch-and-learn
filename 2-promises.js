const co = require('co');
const request = require('request-promise');
const chalk = require('chalk');
const printCharacterBios = require('./print-character-bios');

function getJSON(url) {
  // force https
  const httpsUrl = url.replace('http://', 'https://');

  return request(httpsUrl, { resolveWithFullResponse: true }).then(response => {
    console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.statusCode);

    return JSON.parse(response.body);
  });
};

function fetchAllFromResource(resource) {
  return getJSON(resource).then(page => {
    const fetchPage = (page, records) => {
      records = [...records, ...page.results];

      if (!page.next) {
        return records;
      }

      return getJSON(page.next).then(nextPage => fetchPage(nextPage, records));
    }

    return fetchPage(page, []);
  })
};

function loadDataSerially(rootResource) {
  let characters, species, planets;

  return fetchAllFromResource(rootResource.people)
    .then(records => { characters = records; })
    .then(() => fetchAllFromResource(rootResource.species))
    .then(records => { species = records; })
    .then(() => fetchAllFromResource(rootResource.planets))
    .then(records => { planets = records; })
    .then(() => ({ characters, species, planets }));
};

function loadDataInParallel(rootResource) {
  return Promise.all([
    fetchAllFromResource(rootResource.people),
    fetchAllFromResource(rootResource.species),
    fetchAllFromResource(rootResource.planets)
  ]).then(([ characters, species, planets ]) => {
    return { characters, species, planets };
  });
};

getJSON('https://swapi.co/api/')
  .then(rootResource => loadDataSerially(rootResource))
  .then(({ characters, species, planets }) => {
    printCharacterBios(characters, species, planets);
  })
  .catch(error => { console.error(error) }); // handle all errors in one place
