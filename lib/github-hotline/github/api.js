'use strict';
const _ = require('lodash');
const debug = require('debug')('github-hotline:github:api');
const Promise = require('bluebird');

// Rewire-able
var Github = require('github');

const wrappedFunctions  = {
  getIssue: { module: 'issues', fn: 'getRepoIssue' },
  createIssueComment: { module: 'issues', fn: 'createComment' },
  getIssueCommentsAsync: { module: 'issues', fn: 'getComments' }
}

const wrapLibraryFunctionsInPromises = (wrapped, api) => {
  Object.keys(wrappedFunctions).forEach((wrappedFn) => {
    wrapped[wrappedFn] = (params) => {

      debug('Calling ' + wrappedFn);
      debug(params);
      const wrapping = wrappedFunctions[wrappedFn];
      const fnAsync = Promise.promisify(api[wrapping.module][wrapping.fn]);
      const promise = fnAsync(params);

      promise.then(
        (data) => debug('Resolving with: ', data),
        (err) => debug('Failing with: ', err)
      );
      return promise;
    }
  });
}

const ensureEnvVariables = () => {
  if (!process.env.GITHUB_USERNAME && !process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error(
      'Missing environment variables: GITHUB_USERNAME, GITHUB_ACCESS_TOKEN'
    );
  }
}

class GithubApi {
  constructor() {
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

  getIssueComments(params) {
    debug('Calling getIssueComments');
    debug(params);
    return this.getIssue(params).then((issue) => {
      const perPage = 30;
      var page = 0;

      debug('Creating comment generator');
      return (function* generator(issue) {
        const pages = Math.ceil(issue.comments / perPage);

        debug(pages + ' comment pages available');
        while(page < pages) {
          page++;
          let pageParams = { page: page, per_page: perPage };

          debug('Yeilding ' + page + ' of ' + pages);
          yield this.getIssueCommentsAsync(_.assign(pageParams, params))
        }
      }.bind(this))(issue);
    });
  }
};

module.exports = GithubApi;
