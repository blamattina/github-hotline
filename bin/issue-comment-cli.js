#!/usr/bin/env node
var _ = require('lodash'),
    argv = require('minimist')(process.argv.slice(2)),
    help = require('help')(__dirname + '/../doc/issue-comment.txt'),
    debug = require('debug')('github-hotline:issue-comment-cli'),
    chalk = require('chalk'),
    DestinationParser = require('../lib/destination-parser');

function reportError(error) {
  debug('Uncaught exception. Exiting!');
  debug(error);
  console.error(chalk.red('\nERROR: ' + error.message + '\n'));
  help(1);
};

function parseArgs(argv) {
  if (_(argv).has('user') && _(argv).has('repo') && _(argv).has('number')) {
    var user = argv['user'],
        repo = argv['repo'],
        number = argv['number'];
        comment = argv._.slice(0).join(' ');

  } else {
    var destination = argv._[0],
        comment = argv._.slice(1).join(' ');

    var destinationParser = new DestinationParser(destination),
        user = destinationParser.getUser(),
        repo = destinationParser.getRepo(),
        number = destinationParser.getNumber;
  }
  return {
    user: user,
    repo: repo,
    number: number,
    comment: comment
  }
}

try {
  var params = parseArgs(argv);
  if (params.user && params.repo && params.number && params.comment) {
    debug('Issue comment with: ', params);
    console.log({
      user: params.user,
      repo: params.repo,
      number: params.number,
      comment: params.comment
    });
  } else {
    debug('Invalid arguments: ');
    debug(argv);
    help(0);
  }
} catch (error) {
  reportError(error);
}
