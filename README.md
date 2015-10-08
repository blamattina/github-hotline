# github-hotline [![Build Status](https://img.shields.io/circleci/project/blamattina/github-hotline.svg?style=flat-square)](https://circleci.com/gh/blamattina/github-hotline)

> Simple command line utility for commenting on pull requests

## Getting Started

```
npm install -g github-hotline
```

### Commands

#### `issue-comment`

Usage
```
USAGE: issue-comment USER/REPO#NUMBER COMMENT...
       issue-comment --user USER --repo REPO --number NUMBER COMMENT...

  Issue a comment on a pull request.

  USER        github user name
  REPO        github repository name
  NUMBER      pull request number
  COMMENT     comment to leave

Example:

  issue-comment blamattina/github-hotline#3400 This works great!
```

Example
```
$ export GITHUB_USERNAME=username
$ export GITHUB_PASSWORD=personal-access-token
$ issue-comment blamattina/github-hotline#13 Looks good :zap:
Comment Created.
```
