'use strict';
var rewire = require('rewire');
var createIssueComment = rewire('lib/github-hotline/actions/create-issue-comment');

describe('createIssueComment', () => {

  beforeEach(() => {
    this.ApiMock = jasmine.createSpy();
    this.IssueMock = jasmine.createSpy();
    this.mockInstance = jasmine.createSpy();
    this.ApiMock.and.returnValue(this.mockInstance);
    this.IssueMock.prototype = jasmine.createSpyObj('api',
      ['findComment', 'createComment']);
    createIssueComment.__set__({
      GithubApi: this.ApiMock,
      Issue: this.IssueMock
    });
  });

  describe('creating a comment', () => {
    beforeEach(() => {
      this.returnValue = createIssueComment({
        user: 'blamattina',
        repo: 'github-hotline',
        number: 1,
        body: ':zap:'
      });
    });

    it('initializes the api and the issue', () => {
      expect(this.ApiMock).toHaveBeenCalled();
      expect(this.IssueMock).toHaveBeenCalledWith(jasmine.objectContaining({
        api: this.mockInstance,
        user: 'blamattina',
        repo: 'github-hotline',
        number: 1
      }));
    });

    it('creates the comment', () => {
      const mockFn = this.IssueMock.prototype.createComment;
      expect(mockFn).toHaveBeenCalledWith(':zap:');
    });

  });

  describe('creating a comment once', () => {
    describe('when the comment doesnt exist', () => {
      beforeEach(() => {
        this.IssueMock.prototype.findComment.and.returnValue(Promise.reject('foo'))
        this.returnedPromise = createIssueComment({
          once: true,
          user: 'blamattina',
          repo: 'github-hotline',
          number: 1,
          body: ':zap:'
        });
      });

      it('creates the comment', (done) => {
        this.returnedPromise.then(() => {
          const mockFn = this.IssueMock.prototype.createComment;
          expect(mockFn).toHaveBeenCalledWith(':zap:');
          done();
        });
      });
    });

    describe('when the commend already exists', () => {
      beforeEach(() => {
        this.IssueMock.prototype.findComment.and.returnValue(Promise.resolve('foo'))
        this.returnedPromise = createIssueComment({
          once: true,
          user: 'blamattina',
          repo: 'github-hotline',
          number: 1,
          body: ':zap:'
        });
      });

      it('doesnt create a comment', (done) => {
        this.returnedPromise.then(() => {
          const mockFn = this.IssueMock.prototype.createComment;
          expect(mockFn).not.toHaveBeenCalledWith(':zap:');
          done();
        });
      });
    });
  });
});
