#!/bin/sh

ORIGIN=$1
export ROUTER_BASE=/elections-usa-2020
rm -rf dist
npx yarn run generate
scp dist/_nuxt/* $ORIGIN:/var/www/html$ROUTER_BASE/_nuxt
rsync -av dist/ $ORIGIN:/var/www/html$ROUTER_BASE/.


