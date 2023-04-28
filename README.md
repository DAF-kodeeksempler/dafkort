# Præsentation af Datafordelerens WMS og WMTS kort - dafkort

dafkort præsenterer Datafordelerens WMS og WMTS kort.

dafkort anvender [OpenLayers](https://openlayers.org/) til kort funktionalitet.

## Installation

* Installer node fra [Node.js](https://nodejs.org/en/)
* Klon dafkort repositoriet
* Installer dafkort's afhængigheder: npm ci
* Sæt enviroment variablene dafusername og dafpassword til tjenestebrugerens username og password

Test lokalt: npm start

Build: npm run build

host query parameteren kan anvendes til ændre host navnet i tjeneste URL'erne. Default: services.datafordeler.dk
username og password query parametrene kan anvendes til autentifikation
