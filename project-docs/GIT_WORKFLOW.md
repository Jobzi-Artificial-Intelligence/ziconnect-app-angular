# Git workflow

The objective of this document is to guide developers and community in how to implement, create and update the source code pipeline.

# Abstract

The use of PULL-REQUEST (PR) is mandatory for new features to move up the ladder:

    - Staging > Release > Master

The direct merges or fetch can be applicable down in this sequence:

    - Master > Hotfix > Staging

PR to "Staging" and "Master" branches must have the code review and approval of 1 or 2 peer developers

# Branches description!

## Master

    - Stores the official (Tagged) release history
    - Is deployed to 'PRODUCTION' environment
    - Onlye receives PR from "Release" or "Hotfix" branches approved by peer Sr. Developer or Tech Lead
    - Must be Tagged with a version number before build/deploy
    - All "Feature" are forked from "Master"
    - "Release" branh forked from "Master"

## Staging (Prex/Bench environment)

    - "Features" integration branch
    - Pre-production environment with a replica of production databases
    - Is deployed to "Staging" environment
    - It receives PR from "Hotfix" or "Features" via PR that are going into production on the next release
    - "Feature" in this branch will go in next Release and must already be tested by the user or community

## Feature

    - Naming convention: feature/descriptionFromTheBoardOrIssue
    - Must have its own branch and corresponding artifact (Task GitHub board or Issues Page) that will give the name to the branch
    - Features don't interact with "Master" branch, except when forked
    - Can have one or more sub-tasks worked by one or more developers
    - Can merge from "Master" again to mitigate conflicts

## Hotfix

    - Naming convention: hotfix/descriptionFromTheBoardOrIssue
    - Must have its own branch and corresponding artifact (Task GitHub board or Issues Page) that will give the name to the branch
    - Forked directly from "Master"
    - Patches production releases with bug-fixes
    - Merged back to "Master" via PR approved by peer Sr. Developer or Tech Lead
    - Deleted after merging to "Master"

## Development

    - Receives Feature merges directly without PR
    - Used for feature testing by developers/community/users to validate functionality


# Versions and Tags

The build in the new infrastructure are using via library component to tag the frontEnd application.

The standard we are using is semver, you can get more information here: https://semver.org and the main reason is due to the flexibility to have this format tagging: major.minor.revision.

    - 2.100.1

When building the build will add the build number for it (how many commits it is in from of the last tag), so the build will automaticlly add one more number, as follow:

    - 2.100.1.0 > 2.100.1.1 > 2.100.1.2 > etc


# Git workflow diagram

!(images/Gitworflow.png? "Workflow diagram")