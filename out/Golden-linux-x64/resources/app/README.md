![alt](http://i.imgur.com/VKtMI4d.png)
----
**Golden** is a cross-platform Android Netrunner tournament software built on Electron. Thanks to the usage of Electron, Golden can utilise the full power of web technologies to create the most usable and convenient platform for hosting Netrunner tournaments.

### Installation:

Golden is currently in development stage and release versions are not yet prepared.

### Development installation:

- Install [NodeJS](https://nodejs.org/en/)

- Global dependencies: `electron`, `yarn`, `mocha` (testing).  
`sudo npm install -g electron yarn mocha`

- Clone and install the repository:  
`git clone https://github.com/MrHuds0n/golden; cd golden; yarn`

### Scripts:
- `yarn start` - Starts the application.
- `yarn test` - Runs mocha tests

### TODO:
- Bugtest swiss
- Implement the cut
- Implement tournament endings and export

### Credits:
- Coding and development:
  - [MrHudson](http://mrhudson.yt) - Author
- Dependencies:
  - [Electron](https://electron.atom.io/) - Application framework
  - [Babel](https://babeljs.io/) - ES2016 compilation
  - [Mocha](https://mochajs.org/) - Development tests
  - [`electron-compile`](https://github.com/electron/electron-compile) - Jade and Stylus compilation
  - [`duel`](https://github.com/clux/duel) - Progression cut logic
  - [`uuid`](https://github.com/kelektiv/node-uuid) - UUID generation
- Art:
  - [MrHudson](http://mrhudson.yt) - Golden logo and background
  - [unsplash](https://unsplash.com/photos/NwBZ94Leirc) - DMG background
