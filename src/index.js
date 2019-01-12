#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const user = require('./user');
const Review = require('./review');
const MemoryStore = require('./memoryStore');
// const graph = require('./graph');

program
  .version('0.0.1')
  .description('Memorizing program');

program
  .command('review')
  .alias('r')
  .description('Start the review program')
  .action(() => {

    let strategy = 'local';
    let memoryFolderPath = path.join(__dirname, '../');

    // get the logged in user
    if (user.isLoggedIn()) {
      // strategy = user.preferredStrategy;
      console.log('protocol has not been setup for logged in users');
      return;
    }
    else {
      console.log('no user logged in. using default local profile');
    }

    const memoryStore = new MemoryStore({ strategy, memoryFolderPath });
    const reviewProgram = new Review(memoryStore);

    reviewProgram.start();
  });

program
  .command('state')
  .alias('s')
  .description('The current state of your memory')
  .action(() => {

    let strategy = 'local';
    let memoryFolderPath = path.join(__dirname, '../');
    const memoryStore = new MemoryStore({ strategy, memoryFolderPath });

    memoryStore.getState();

  });

program.parse(process.argv);