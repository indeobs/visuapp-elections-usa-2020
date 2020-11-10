# indie-obs-elections-usa-2020

This is a NuxtJS static website.

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
https://github.com/mediafin/usa-elections-2020

https://github.com/ellisp/usa-count-2020/blob/main/webtool/R/load_data.R
https://raw.githubusercontent.com/alex/nyt-2020-election-scraper/master/battleground-state-changes.csv
https://github.com/alex/nyt-2020-election-scraper/

[ -d gen ] || mkdir gen
( cd dataset-elections-usa-2020-presidential-foxnewsfeed; node ./node/extract-processingballot-by-state-by-day.js; ) > gen/processingballot-by-state-by-day.json

