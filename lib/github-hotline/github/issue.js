function Issue(params) {
  this.api = params.api;
  this.user = params.user;
  this.repo = params.repo;
  this.number = params.number;
}

Issue.prototype = {
  createComment: function (body) {
    return this.api.createIssueComment({
      user: this.user,
      repo: this.repo,
      number: this.number,
      body: body
    });
  }
}

module.exports = Issue;
