'use strict';
var _ = require('lodash');
var rewire = require('rewire');
var Github = require('github');
var GithubApi = rewire('lib/github-hotline/github/api');
var Promise = require('bluebird');

describe('GithubApi', () => {

  beforeEach(() => {
    this.GithubMock = jasmine.createSpy();
    this.GithubMock.prototype.authenticate = jasmine.createSpy();
    this.GithubMock.prototype.issues = jasmine.createSpyObj('Issues',
      ['createComment', 'getRepoIssue', 'getComments']);

    GithubApi.__set__({
      Github: this.GithubMock,
      process: { env: { GITHUB_USERNAME: 'foo', GITHUB_ACCESS_TOKEN: 'bar' }}
    });

    this.githubApi = new GithubApi()
  });

  describe('.constructor', () => {
    describe('without credentials', () => {
      it('raises an exception', () => {
        GithubApi.__set__({ process: { env: {}}});
        var credentialException = () => { new GithubApi() }
        expect(credentialException).toThrow()
      });
    });

    describe('with credentials', () => {
      it('doesnt raise an exception', () => {
        var credentialException = () => { new GithubApi() }
        expect(credentialException).not.toThrow()
      });

      it('initializes the api client', () => {
        expect(this.GithubMock).toHaveBeenCalledWith(jasmine.objectContaining({
          version: '3.0.0'
        }));
      });

      it('authenticates the api client', () => {
        var authenticateSpy = this.GithubMock.prototype.authenticate;
        expect(authenticateSpy).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'basic',
          username: 'foo',
          password: 'bar'
        }));
      });
    });

    describe('with an enterprise host', () => {
      it('initializes the api client', () => {
        GithubApi.__get__('process').env.GITHUB_ENTERPRISE_HOSTNAME = 'foo.bar';
        new GithubApi()
        expect(this.GithubMock).toHaveBeenCalledWith(jasmine.objectContaining({
          host: 'foo.bar',
          pathPrefix: '/api/v3'
        }));
      });
    });
  });

  describe('wrapped api functions', () => {
    const WRAPPED_FUNCTIONS = GithubApi.__get__('wrappedFunctions');
    _.forIn(WRAPPED_FUNCTIONS, (wrapped, method) => {
      describe('#' + method, () => {
        beforeEach(() => {
          this.params = { foo: 'foo', bar: 'bar' }
          this.returnValue = this.githubApi[method](this.params);
        });

        it('wraps an existing api client function', () => {
          var github = new Github({version: '3.0.0'});
          var fnToPromisify = github[wrapped.module][wrapped.fn];
          expect(fnToPromisify).toEqual(jasmine.any(Function));
        })

        it('calls the api', () => {
          var mockFn = this.GithubMock.prototype[wrapped.module][wrapped.fn];
          expect(mockFn).toHaveBeenCalledWith(this.params, jasmine.any(Function));
        });

        it('returns a promise', () => {
          expect(this.returnValue.then).toBeDefined()
          expect(this.returnValue.then).toEqual(jasmine.any(Function));
        });
      })
    });
  });

  describe('#getIssueComments', () => {

    beforeEach(() => {
      this.params = { user: 'foo', repo: 'bar', number: 42 };
      spyOn(this.githubApi, 'getIssue').and.returnValue(
        Promise.resolve({comments: 80})
      );
      this.returnedPromise = this.githubApi.getIssueComments(this.params);
    });

    it('returns a promise that resolves with a generator', (done) => {
      this.returnedPromise.then((generator) => {
        expect(generator).toEqual(jasmine.objectContaining({
          next: jasmine.any(Function)
        }));
        done();
      });
    });

    describe('comment generator', () => {
      beforeEach(() => {
        spyOn(this.githubApi, 'getIssueCommentsAsync').and.callFake(() => {
          return Promise.resolve('foo');
        });

      });

      it('returns a promise that resolves with a page of comments', (done) => {
        this.returnedPromise.then((generator) => {
          var promise = generator.next().value;
          const mockFn = this.githubApi.getIssueCommentsAsync;

          expect(mockFn).toHaveBeenCalledWith(jasmine.objectContaining({
            user: this.params.user,
            repo: this.params.repo,
            number: this.params.number,
            page: 1,
          }));

          promise.then((data) => {
            expect(data).toBe('foo');
            done()
          })
        });
      });

      it('yields promises untill all pages have been returned', (done) => {
        this.returnedPromise.then((generator) => {
          Promise.all([
            generator.next().value,
            generator.next().value,
            generator.next().value,
            generator.next().value,
            generator.next().value
          ]).then((values) => {
            const mockFn = this.githubApi.getIssueCommentsAsync;
            expect(values.length).toBe(5);
            expect(mockFn.calls.count()).toBe(3);
            done()
          });
        });
      });
    });
  });
});
