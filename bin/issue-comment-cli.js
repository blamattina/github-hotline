#!/usr/bin/env node
var _ = require('lodash'),
    argv = require('minimist')(process.argv.slice(2)),
    help = require('help')(__dirname + '/../doc/issue-comment.txt'),
    debug = require('debug')('github-hotline:issue-comment-cli'),
    chalk = require('chalk'),
    DestinationParser = require('../lib/destination-parser'),
    hotline = require('../lib/github-hotline');

function reportSuccess(data) {
  debug('Message sent');
  debug(data);
  console.log('Message Sent!');
  process.exit(0);
}

function reportError(error) {
  debug('Uncaught exception. Exiting!');
  debug(error);
  console.error(chalk.red('\nERROR: ' + error.message + '\n'));
  help(1);
}

function parseArgs(argv) {
  if (_(argv).has('user') && _(argv).has('repo') && _(argv).has('number')) {
    var user = argv['user'],
        repo = argv['repo'],
        number = argv['number'];
        body = argv._.slice(0).join(' ');

  } else if (argv._.length >= 2) {
    var destination = argv._[0],
        body = argv._.slice(1).join(' ');

    var destinationParser = new DestinationParser(destination),
        user = destinationParser.getUser(),
        repo = destinationParser.getRepo(),
        number = destinationParser.getNumber();
  } else {
    debug('Invalid arguments: ');
    debug(argv);
    help(0);
  }
  return {
    user: user,
    repo: repo,
    number: number,
    body: body
  }
}

try {
  var params = parseArgs(argv);
  debug('Issue comment with: ', params);
  hotline.createIssueComment({
    user: params.user,
    repo: params.repo,
    number: params.number,
    body: params.body
  }).then(reportSuccess, reportError);
} catch (error) {
  reportError(error);
}
