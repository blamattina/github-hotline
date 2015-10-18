'use strict';
var Promise = require('bluebird');
var GithubApi = require('../github/api');
var Issue = require('../github/issue');

const ALREADY_EXISTS = 'Not created. A comment with this message already exists.';

module.exports = (params) => {
  const api = new GithubApi();
  const issue = new Issue({
    api: api,
    user: params.user,
    repo: params.repo,
    number: params.number
  });

  const createComment = () => issue.createComment(params.body);
  const alreadyExists = () => Promise.resolve(ALREADY_EXISTS);

  if(params.once) {
    return issue.findComment({body: params.body})
      .then(alreadyExists, createComment);
  } else {
    return createComment();
  }
};
