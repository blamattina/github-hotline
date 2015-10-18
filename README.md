# github-hotline [![Build Status](https://img.shields.io/circleci/project/blamattina/github-hotline.svg?style=flat-square)](https://circleci.com/gh/blamattina/github-hotline) [![npm](https://img.shields.io/npm/v/github-hotline.svg?style=flat-square)](https://www.npmjs.com/package/github-hotline)
> Simple command line utility for commenting on pull requests

## Getting Started

```
npm install -g github-hotline
```

### Commands

#### `issue-comment`

Usage
```
USAGE: issue-comment [--once] USER/REPO#NUMBER COMMENT...
       issue-comment [--once] -u USER -r REPO -n NUMBER COMMENT...

  Issue a comment on a pull request.

  USER        github user name
  REPO        github repository name
  NUMBER      pull request number
  COMMENT     comment to leave

  Options:

  --once      create this comment if it does not already exist

Example:

  issue-comment blamattina/github-hotline#3400 This works great!

```

Example
```
# Create a comment on an issue
$ export GITHUB_USERNAME=username
$ export GITHUB_PASSWORD=personal-access-token
$ issue-comment blamattina/github-hotline#13 Looks good :zap:
Comment Created.
```
```
# Create a comment on an issue if one with the same body does not exist
$ issue-comment --once blamattina/github-hotline#1 Looks good
Comment created.
$ issue-comment --once blamattina/github-hotline#1 Looks good
Not created. A comment with this message already exists.
```
