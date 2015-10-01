#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(1)),
    help = require('help')(__dirname + '/../doc/issue-comment.txt'),
    debug = require('debug')('github-hotline:issue-comment-cli');

var destination = argv._[1],
    comment = argv._.slice(2).join(' ');

if (!(destination && comment)) {
  debug('Invalid arguments: ');
  debug(argv);
  help(0);
} else {
  debug('Destination: ' + destination);
  debug('Comment: ' + comment);
  console.log(destination + comment);
}
