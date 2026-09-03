#!/bin/bash
set -e

cd ubuntuos
npm ci
npm run build
cd ..

rm -rf _site
mkdir _site

# Copy the existing EtherealOS site
cp index.html _site/
cp -r images _site/
cp -r macos _site/
cp -r ubuntu _site/
cp -r windows _site/

# Add the built UbuntuOS
cp -r ubuntuos/dist _site/ubuntuos
