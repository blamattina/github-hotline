'use strict';
var _ = require('lodash');
var debug = require('debug')('github-hotline:github:issue');

class Issue {
  constructor(params) {
    this.api = params.api;
    this.user = params.user;
    this.repo = params.repo;
    this.number = params.number;
  }

  createComment(body) {
    return this.api.createIssueComment({
      user: this.user,
      repo: this.repo,
      number: this.number,
      body: body
    });
  }

  findComment(source) {
    var commentGenerator;

    const setGenerator = (generator) => commentGenerator = generator;
    const hasFoundComment = (comments) => _(comments).findWhere(source);

    function findCommentRecursively() {
      debug('Recursively searching for comments');
      const commentPromise = commentGenerator.next().value;
      debug(commentPromise);
      if (commentPromise) {
        return commentPromise.then((comments) => {
          return hasFoundComment(comments) || findCommentRecursively();
        });
      }
      return Promise.reject('Comment not found.');
    };

    const issueParams = {
      user: this.user,
      repo: this.repo,
      number: this.number
    };
    return this.api.getIssueComments(issueParams)
      .then(setGenerator)
      .then(findCommentRecursively);
  }
}

module.exports = Issue;
