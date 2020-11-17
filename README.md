# indeobs-visuapp-elections-usa-2020

This is a NuxtJS static website.

Deployed and hopefully up on https://www.indeobs.org/elections-usa-2020/

## Preparing the data before building
```
git submodule init
git submodule update
[ -d gen ] || mkdir gen
( cd datasets/presidential-foxnewsfeed; node ./node/extract-processingballot-timeseries-by-electoral-area.js; ) > gen/fox-processingballot-timeseries-by-electoral-area.json
( cd datasets/; node nyt-2020-election-scraper-extract-processingballot-timeseries-by-electoral-area.js; ) > gen/nyt-processingballot-timeseries-by-electoral-area.json
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## deploy on origin nginx
```
./deploy $YOUR_SERVER
```
