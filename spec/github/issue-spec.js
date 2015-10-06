var Promise = require('bluebird');
var Issue = require('lib/github-hotline/github/issue');

describe('Issue', function () {

  beforeEach(function() {
    this.api = jasmine.createSpyObj('GithubApi', ['createIssueComment']);
    this.user = 'blamattina'
    this.repo = 'github-hotline'
    this.number = 42

    this.issue = new Issue({
      api: this.api,
      user: this.user,
      repo: this.repo,
      number: this.number
    });
  });

  describe('.constructor', function () {

    it('sets the api', function () {
      expect(this.issue.api).toBe(this.api);
    });

    it('sets the user', function () {
      expect(this.issue.user).toBe(this.user);
    });

    it('sets the repo', function () {
      expect(this.issue.repo).toBe(this.repo);
    });

    it('sets the number', function () {
      expect(this.issue.number).toBe(this.number);
    });

  });


  describe('#createIssueComment', function () {

    beforeEach(function () {
      this.returnedPromise = Promise.resolve();
      this.api.createIssueComment.and.returnValue(this.returnedPromise);
    });

    it('creates a comment with the api', function () {
      this.issue.createComment('Looks good!');
      expect(this.api.createIssueComment).toHaveBeenCalledWith(jasmine.objectContaining({
        user: this.user,
        repo: this.repo,
        number: this.number,
        body: 'Looks good!'
      }));
    });

    it('returns a promise', function () {
      var returnValue = this.issue.createComment('Looks good!');
      expect(returnValue).toBe(this.returnedPromise);
    });
  });

});
