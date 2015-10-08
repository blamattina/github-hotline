var DestinationParser = require('../lib/github-hotline/destination-parser');

describe('DestinationParser', function() {

  beforeEach(function() {
    this.destination = 'blamattina/github-hotline_2#12030';
    this.parser = new DestinationParser(this.destination);
  });

  describe('.constructor', function () {

    beforeEach(function() {
      this.badFormat = 'what//huh##1d';
      this.badUser = '-wrong/repo-name#1';
      this.badRepo = 'user//huh#1';
      this.badNumber = 'user/repo-name#d';
    });

    it('raises an exception when the format is correct', function () {
      var good = function () {
        new DestinationParser(this.destination)
      }.bind(this);
      expect(good).not.toThrow()
    });

    it('raises an exception when the format is incorrect', function () {
      var badFormat = function () {
        new DestinationParser(this.badFormat)
      }.bind(this);
      expect(badFormat).toThrow()
    });

    it('raises an exception when the user is incorrect', function () {
      var badUser = function () {
        new DestinationParser(this.badUser)
      }.bind(this);
      expect(badUser).toThrow()
    });

    it('raises an exception when the repo is incorrect', function () {
      var badRepo = function () {
        new DestinationParser(this.badRepo)
      }.bind(this);
      expect(badRepo).toThrow()
    });

    it('raises an exception when the number is incorrect', function () {
      var badNumber = function () {
        new DestinationParser(this.badNumber)
      }.bind(this);
      expect(badNumber).toThrow()
    });
  });

  describe('#getUser', function() {
    it('returns the user', function () {
      expect(this.parser.getUser()).toBe('blamattina')
    });
  });

  describe('#getRepo', function() {
    it('returns the user', function () {
      expect(this.parser.getRepo()).toBe('github-hotline_2')
    });
  });

  describe('#getNumber', function() {
    it('returns the user', function () {
      expect(this.parser.getNumber()).toBe(12030)
    });
  });
});
