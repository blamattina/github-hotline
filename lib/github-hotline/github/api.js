var _ = require('lodash');
var debug = require('debug')('pull-request-hotline:githup-api');
var Github = require('github');
var Promise = require('bluebird');

var wrappedFunctions  = {
  createIssueComment: { module: 'issues', fn: 'createComment' }
}

var wrapLibraryFunctionsInPromises = function(wrapped, api) {
  Object.keys(wrappedFunctions).forEach(function(wrappedFn) {
    wrapped[wrappedFn] = function(params) {
      debug('Calling ' + wrappedFn);
      debug(params);
      var wrapping = wrappedFunctions[wrappedFn];
      var fnAsync = Promise.promisify(api[wrapping.module][wrapping.fn]);
      return fnAsync(params);
    }
  });
}

function ensureEnvVariables() {
  if (!process.env.GITHUB_USERNAME && !process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error(
      'Missing environment variables: GITHUB_USERNAME, GITHUB_ACCESS_TOKEN'
    );
  }
}

function GithubApi() {
  debug('Creating Github API wrapper.');
  ensureEnvVariables();

  var options = {
    version: "3.0.0"
  };

  if (process.env.GITHUB_ENTERPRISE_HOSTNAME) {
    options.host = process.env.GITHUB_ENTERPRISE_HOSTNAME;
    options.pathPrefix = '/api/v3';
    debug('Using Github Host: ' + options.host);
  }

  this.api = new Github(options);
  debug('Authenticating as: ' + process.env.GITHUB_USERNAME);
  this.api.authenticate({
    type: 'basic',
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_ACCESS_TOKEN
  });

  wrapLibraryFunctionsInPromises(this, this.api);
}

module.exports = GithubApi;
