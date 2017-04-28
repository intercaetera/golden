![alt](http://i.imgur.com/VKtMI4d.png)
----
**Golden** is a cross-platform Android Netrunner tournament software built on Electron. Thanks to the usage of Electron, Golden can utilise the full power of web technologies to create the most usable and convenient platform for hosting Netrunner tournaments.

[![GitHub issues](https://img.shields.io/github/issues/MrHuds0n/golden.svg)](https://github.com/MrHuds0n/golden/issues)
[![GitHub forks](https://img.shields.io/github/forks/MrHuds0n/golden.svg)](https://github.com/MrHuds0n/golden/network)
[![GitHub stars](https://img.shields.io/github/stars/MrHuds0n/golden.svg)](https://github.com/MrHuds0n/golden/stargazers)
[![GitHub license](https://img.shields.io/badge/license-GPL-blue.svg)](https://raw.githubusercontent.com/MrHuds0n/golden/photon/LICENSE)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=mail%40mrhudson%2eyt&lc=PL&item_name=Golden&no_note=0&cn=Donation%20message&no_shipping=2&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)


[![Twitter](https://img.shields.io/twitter/url/https/github.com/MrHuds0n/golden.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

## Installation:

See [Releases](https://github.com/MrHuds0n/golden/releases)

## Features:

- Swiss system for the elimination rounds.
- JSON serialisation for saving and loading tournaments.
- A round timer for Swiss rounds.
- A progression cut system.
- Integration with the [Monolith](http://monolith.ga) web services platform.

## Bugs:

This is an alpha. There will be bugs. To spot them, you can open the Developer console (`Ctrl+Shift+I`) and inspect any issues you might have.

To report bugs, please visit the GitHub [Issues](https://github.com/MrHuds0n/golden/issues) and post any bugs you encounter **as well as steps on how to reproduce them**. Copy-pasting the console log can also help out a great deal.

## Development installation:

- Install [NodeJS](https://nodejs.org/en/) and [Git](https://git-scm.com/)

- Global dependencies: `electron`, `yarn`, `mocha` (testing).  
`sudo npm install -g electron yarn mocha`

- Clone and install the repository:  
`git clone https://github.com/MrHuds0n/golden; cd golden; yarn`

## Scripts:
- `yarn start` - Starts the application.
- `yarn test` - Runs mocha tests
- `yarn package` - Package the app for your current system
- `yarn make` - Make the package for your current system

## TODO:
- Implement quick scoring
- Implement cut serialisation

## Credits:
- Coding and development:
  - [MrHudson](http://mrhudson.yt) - Author
- Dependencies:
  - [Electron](https://electron.atom.io/) - Application framework
  - [Babel](https://babeljs.io/) - ES2016 compilation
  - [Mocha](https://mochajs.org/) - Development tests
  - [Photon](http://photonkit.com) - User interface framework
  - [`electron-compile`](https://github.com/electron/electron-compile) - Jade and Stylus compilation
  - [`duel`](https://github.com/clux/duel) - Progression cut logic
  - [`uuid`](https://github.com/kelektiv/node-uuid) - UUID generation
  - [`clone`](https://www.npmjs.com/package/clone) - JavaScript object deep cloning.
  - [`qr-image`](https://www.npmjs.com/package/qr-image) - QR code generation.

- Art:
  - [MrHudson](http://mrhudson.yt) - Golden logo and background
