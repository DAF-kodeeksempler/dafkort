# Præsentation af Datafordelerens WMS og WMTS kort - dafkort

dafkort præsenterer Datafordelerens WMS og WMTS kort.

Datafordelerens og Kortforsyningens præsentation af de mest populære kort kan på en let måde sammenlignes.

Valg af en bounding box til anvendelse ved Datafordelerens REST forespørgelser (B knappen). 

dafkort anvender [OpenLayers](https://openlayers.org/) til kort funktionalitet.

## Installation

* Installer node fra [Node.js](https://nodejs.org/en/)
* Klon dafkort repositoriet
* Installer dafkort's afhængigheder: npm ci
* Sæt enviroment variablene dafusername og dafpassword til tjenestebrugerens username og password
* Sæt enviroment variablen kftoken til autentifikationstoken fra Kortforsyningen

Test lokalt: npm start

Build: npm run build

