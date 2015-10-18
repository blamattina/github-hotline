#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2), {boolean: true}),
    help = require('help')(__dirname + '/../doc/issue-comment.txt'),
    debug = require('debug')('github-hotline:issue-comment-cli'),
    chalk = require('chalk'),
    DestinationParser = require('../lib/github-hotline/destination-parser'),
    hotline = require('../');

const reportSuccess = (data) => {
  debug('Exiting successfully.');
  debug(data);
  if(typeof data == 'object' && data.meta.status == '201 Created') {
    console.log('Comment Created.')
  } else {
    console.log(data);
  }
  process.exit(0);
}

const reportError = (error) => {
  debug('Uncaught exception. Exiting!');
  debug(error);
  console.error(chalk.red('\nERROR: ' + error.message + '\n'));
  help(1);
}

const parseArgs = (argv) => {
  var once = !!argv['once'];

  if (argv.user && argv.repo && argv.number) {
    var user = argv['u'],
        repo = argv['r'],
        number = argv['n'];
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
    return help(1);
  }
  return {
    once: once,
    user: user,
    repo: repo,
    number: number,
    body: body
  }
}

try {
  var params = parseArgs(argv);
  if (params) {
    debug('Issue comment with...');
    debug(params);
    hotline.createIssueComment({
      once: params.once,
      user: params.user,
      repo: params.repo,
      number: params.number,
      body: params.body
    }).then(reportSuccess, reportError);
  }
} catch (error) {
  reportError(error);
}
