![alt](http://i.imgur.com/VKtMI4d.png)
----
**Golden** is a cross-platform Android Netrunner tournament software built on Electron. Thanks to the usage of Electron, Golden can utilise the full power of web technologies to create the most usable and convenient platform for hosting Netrunner tournaments.

## Installation:

See [Releases](https://github.com/MrHuds0n/golden/releases)

## Features:

- Swiss system for the elimination rounds.
- JSON serialisation for saving and loading tournaments.
- A round timer for Swiss rounds.
- A progression cut system (which is not serialised because holy crap the person who wrote the module is smart but really bad at writing documentations).
- Integration with the [Monolith](http://monolith.ga) web services platform.

## Usage instructions:

### General:

- To create a new tournament click `New Tournament` in the welcome screen. All fields are optional. When you click the second New tournament button, you will be asked to save the tournament file.

- To load a tournament, click the `Load tournament` button and find a previously saved `*.cjson` file.

- To save your tournament at any moment later, click the Save button in the top left. **Remember that progression cut is not saved.**

- To add a player to the tournament, click the `Add player` button at the top and fill out the form. `Name` is mandatory. `Superbye` is a common name for the first-round bye awarded for winning a lower-tier tournament.

### Swiss:

- The Players view is intended to be a short and quick leaderboard for the Swiss rounds, there you can also drop players from the tournament. **Dropping players from the tournament is permanent**. (It actually isn't but you can only change it via console, this will be changed later).

- The Rounds view is a summary of all completed Swiss rounds as well as the pending one.

- The Matches view is the utility for displaying the ongoing round and its matches, scoring them and seating the players.

- To start a new round, click the `New round` button. This will also start the clock.

### Cut:

- To start the cut, at any point you can go to the Matches view in the Progression Cut section and begin the cut. It's recommended to start the cut after all the matches in the current round have been scored and a new round has not yet been generated (it should work regardless, but spontaneous explosions might happen).

- During the cut the players will be paired up in both brackets.

- Once the cut reaches the final, please remember that the last round should be scored when it is sure that there will be no second match. The player coming from the upper bracket should be declared the winner on the scores `1:0` and `1:1`. The player from the lower bracket should be declared winner only on the score `0:2`.

- Yeah I know the finals are in the lower bracket, this is [intended and logical](https://github.com/clux/duel#caveats).

## Bugs:

This is an alpha. There will be bugs. To spot them, you can open the Developer console (`Ctrl+Shift+I`) and inspect any issues you might have.

To report bugs, please visit the GitHub [Issues](https://github.com/MrHuds0n/golden/issues) and post any bugs you encounter **as well as steps on how to reproduce them**. Copy-pasting the console log can also help out a great deal.

## Development installation:

- Install [NodeJS](https://nodejs.org/en/)

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
