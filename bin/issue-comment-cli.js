#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(1)),
    help = require('help')(__dirname + '/../doc/issue-comment.txt'),
    debug = require('debug')('github-hotline:issue-comment-cli'),
    chalk = require('chalk'),
    DestinationParser = require('../lib/destination-parser');

var destination = argv._[1],
    comment = argv._.slice(2).join(' ');

var reportError = function(error) {
  debug('Uncaught exception. Exiting!');
  debug(error);
  console.error(chalk.red('\nERROR: ' + error.message + '\n'));
  help(1);
};

if (!(destination && comment)) {
  debug('Invalid arguments: ');
  debug(argv);
  help(0);
} else {
  debug('Destination: ' + destination);
  debug('Comment: ' + comment);
  try {
    var destinationParser = new DestinationParser(destination);
    console.log({
      user: destinationParser.getUser(),
      repo: destinationParser.getRepo(),
      number: destinationParser.getNumber(),
      comment: comment
    });

  } catch (error) {
    reportError(error);
  }
}
