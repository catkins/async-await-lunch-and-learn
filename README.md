# Async / await

## Code Examples from Lunch and Learn 29/06/2016

4 approaches to writing a very simple script which prints out some basic profile information about Star Wars characters from the [Star Wars Hypermedia API](https://swapi.co/) whilst taming asynchrony in different ways.

1. [Callbacks](./1-callbacks.js)
2. [Promises](./2-promises.js)
3. [Generators + co](./3-generators.js)
4. [Async / Await](./4-async-await.js)

Each approach loads the data in a different manner, but same format and passes it to the [`print-character-bios`](./print-character-bios.js) module.

Note that all examples use native NodeJS features without a transpilation **except** for the async/await version. The last example uses the [transform-async-to-generator Babel plugin](https://babeljs.io/docs/plugins/transform-async-to-generator/) to compile async functions down to ES6 generators.

## Setup

```sh
# install node 6
nvm install v6.2.2

# install dependencies
npm install
```

## Running the scripts

```
npm run callbacks
npm run promises
npm run generators
npm run async-await
```

## API endpoints consumed

- http://swapi.co/api/ - the root resource
- http://swapi.co/api/people/ - characters from the movies
- http://swapi.co/api/species/ - species in the movies
- http://swapi.co/api/planets/ - planets from the movies

## Resources

- [Callback Hell](http://callbackhell.com/)
- [MDN Docs - `function*` (generators)](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*)
- [tj/co](https://github.com/tj/co) - coroutines library
- [TC39 Async/Await Proposal](https://tc39.github.io/ecmascript-asyncawait/)
- [Async and Await](https://zeit.co/blog/async-and-await) - blog post by Guillermo Rauch, creator of socket.io
