var GithubApi = require('../github/api');
var Issue = require('../github/issue');

module.exports = function createIssueComment(params) {

  var api = new GithubApi();

  var issue = new Issue({
    api: api,
    user: params.user,
    repo: params.repo,
    number: params.number
  });

  issue.createComment(params.body);
};
