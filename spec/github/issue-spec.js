'use strict';
var Promise = require('bluebird');
var Issue = require('lib/github-hotline/github/issue');

describe('Issue', () => {

  beforeEach(() => {
    this.api = jasmine.createSpyObj('GithubApi', ['createIssueComment', 'getIssueComments']);
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

  describe('.constructor', () => {

    it('sets the api', () => {
      expect(this.issue.api).toBe(this.api);
    });

    it('sets the user', () => {
      expect(this.issue.user).toBe(this.user);
    });

    it('sets the repo', () => {
      expect(this.issue.repo).toBe(this.repo);
    });

    it('sets the number', () => {
      expect(this.issue.number).toBe(this.number);
    });

  });


  describe('#createIssueComment', () => {

    beforeEach(() => {
      this.returnedPromise = Promise.resolve();
      this.api.createIssueComment.and.returnValue(this.returnedPromise);
    });

    it('creates a comment with the api', () => {
      this.issue.createComment('Looks good!');
      expect(this.api.createIssueComment).toHaveBeenCalledWith(jasmine.objectContaining({
        user: this.user,
        repo: this.repo,
        number: this.number,
        body: 'Looks good!'
      }));
    });

    it('returns a promise', () => {
      var returnValue = this.issue.createComment('Looks good!');
      expect(returnValue).toBe(this.returnedPromise);
    });
  });

  describe('#findComment', () => {
    beforeEach(() => {
      const mockGenerator = (function* () {
        yield Promise.resolve([{body: 1}, {body: 2}])
        yield Promise.resolve([{body: 3}, {body: 4}])
        yield Promise.resolve([{body: 5}, {body: 6}])
      })();
      this.returnedPromise = Promise.resolve(mockGenerator);
      this.api.getIssueComments.and.returnValue(this.returnedPromise);
    });

    describe('when a comment exists', () => {
      it('resolves with the found comment', (done) => {
        this.issue.findComment({body: 6}).then((foundComment) => {
          expect(foundComment).toEqual(jasmine.objectContaining({body: 6}));
          done()
        });
      });
    });
    describe('when a comment doesnt exist', () => {
      it('rejects', (done) => {
        let noop = () => false
        this.issue.findComment({body: 'foo'}).then(noop, (error) => {
          expect(error).toEqual('Comment not found.');
          done()
        });
      });
    });
  });
});
