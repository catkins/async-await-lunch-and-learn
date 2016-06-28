const request = require('request');
const chalk = require('chalk');
const printCharacterBios = require('./print-character-bios');

function getJSON(url, callback) {
  // force https
  const httpsUrl = url.replace('http://', 'https://');

  return request(httpsUrl, (error, response, body) => {
    // bad request
    if (error || response.statusCode >= 400) {
      callback(error);
      return;
    }

    try {
      const json = JSON.parse(body);
      console.log(chalk.green('GET'), chalk.blue(httpsUrl), response.statusCode);

      callback(null, json);
    } catch (error) { // error parsing json
      callback(error);
    }
  });
}

function fetchAllFromResource (resource, callback) {
  const fetchPage = (path, records, callback) => {
    getJSON(path, (error, page) => {
      if (error) {
        callback(error);
        return;
      }

      const updatedRecords = [...records, ...page.results];

      if (page.next) {
        fetchPage(page.next, updatedRecords, callback);
      } else {
        callback(null, updatedRecords);
      }
    });
  };

  fetchPage(resource, [], callback);
}

getJSON('https://swapi.co/api/', (error, rootResource) => {
  fetchAllFromResource(rootResource.people, (error, characters) => {
    if (error) {
      console.error('error requesting characters', error);
      return;
    }

    fetchAllFromResource(rootResource.species, (error, species) => {
      if (error) {
        console.error('error requesting species', error);
        return;
      }

      fetchAllFromResource(rootResource.planets, (error, planets) => {
        if (error) {
          console.error('error requesting planets', error);
          return;
        }

        printCharacterBios(characters, species, planets);
      });
    });
  });
});
