var _ = require('lodash');
var rewire = require("rewire");
var GithubApi = rewire('lib/github-hotline/github/api');

describe('GithubApi', function() {

  beforeEach(function() {
    this.GithubMock = jasmine.createSpy();
    this.GithubMock.prototype.authenticate = jasmine.createSpy();
    this.GithubMock.prototype.issues = jasmine.createSpyObj('Issues',
      ['createComment']);

    GithubApi.__set__({
      Github: this.GithubMock,
      process: { env: { GITHUB_USERNAME: 'foo', GITHUB_ACCESS_TOKEN: 'bar' }}
    });

    this.githubApi = new GithubApi()
  });

  describe('.constructor', function() {
    describe('without credentials', function() {
      it('raises an exception', function() {
        GithubApi.__set__({ process: { env: {}}});
        var credentialException = function() { new GithubApi() }
        expect(credentialException).toThrow()
      });
    });

    describe('with credentials', function() {
      it('doesnt raise an exception', function() {
        var credentialException = function() { new GithubApi() }
        expect(credentialException).not.toThrow()
      });

      it('initializes the api client', function() {
        expect(this.GithubMock).toHaveBeenCalledWith(jasmine.objectContaining({
          version: '3.0.0'
        }));
      });

      it('authenticates the api client', function() {
        var authenticateSpy = this.GithubMock.prototype.authenticate;
        expect(authenticateSpy).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'basic',
          username: 'foo',
          password: 'bar'
        }));
      });
    });

    describe('with an enterprise host', function() {
      it('initializes the api client', function() {
        GithubApi.__get__('process').env.GITHUB_ENTERPRISE_HOSTNAME = 'foo.bar';
        new GithubApi()
        expect(this.GithubMock).toHaveBeenCalledWith(jasmine.objectContaining({
          host: 'foo.bar',
          pathPrefix: '/api/v3'
        }));
      });
    });
  });

  describe('#createIssueComment', function() {
    beforeEach(function() {
      this.params = { foo: 'foo', bar: 'bar' }
      this.returnValue = this.githubApi.createIssueComment(this.params);
    });

    it('calls the api', function() {
      var mockFn = this.GithubMock.prototype.issues.createComment;
      expect(mockFn).toHaveBeenCalledWith(this.params, jasmine.any(Function));
    });

    it('returns a promise', function() {
      expect(this.returnValue.then).toBeDefined()
      expect(this.returnValue.then).toEqual(jasmine.any(Function));
    });
  });
});
