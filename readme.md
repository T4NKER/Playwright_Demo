# Test Suite Overview

## Introduction
This test suite automates key functionalities of the EpicBet platform using Playwright. It focuses on ensuring the reliability of search and betting functionalities across multiple environments.

## Table of Contents
 [Tests](#tests)
   - [Fetch and Validate Matches](#1-fetch-and-validate-matches)
   - [Fetch and Validate Leagues](#2-fetch-and-validate-leagues)
   - [Betting](#3-betting)
[Logger](#logger)

 [Known Issues](#known-issues)

 [Browser Compatibility](#browser-compatibility)

 [CI/CD Pipeline](#ci-cd-pipeline)

 [Additional Remarks](#additional-remarks)

---

## Tests

### 1. Fetch and Validate Matches
#### Objective
Ensure matches displayed on the homepage can be accurately searched and validated.

#### Steps
1. Fetch match data using the `getMatches` helper function.
2. Open the search modal and input match names.
3. Validate that search results contain relevant matches.
4. Close the search modal.

#### Helpers Used
- `getMatches(page, limit, logger)`
- `testSearchTerm(page, term, logger)`

#### Known Issues
- Inconsistencies in search results for certain matches.

---

### 2. Fetch and Validate Leagues
#### Objective
Ensure league names displayed on the homepage appear correctly in search results.

#### Steps
1. Fetch league names using the `getLeagues` helper function.
2. Open the search modal for each league name.
3. Input league names into the search field.
4. Validate that the search results contain relevant leagues.
5. Close the search modal.

#### Helpers Used
- `getLeagues(page, limit, logger)`
- `testSearchTerm(page, term, logger)`

#### Known Issues
- Some leagues (e.g., NBA, Ligue 1, and La Liga) do not appear in search results due to platform bugs.
- Only certain leagues, like Euroleague and Premier League, consistently pass the test.

---

### 3. Betting
#### Objective
Validate betting functionality for spotlight matches and combobets.

#### Steps
1. Go to the main page.
2. Select bets for the spotlight or combobets.
3. Check if the betting amount input field is displayed.
4. Insert the amount and validate the betslip.
5. Check if the authentication modal appears.

---

## Logger
The custom logger supports adjustable log levels:
- `error`
- `warn`
- `info` (default for testing environments)
- `debug`

To adjust the log level, modify the configuration in `search.spec.js`.

---

## Known Issues
### 1. Search Inconsistencies
- Matches and leagues may not always appear in search results due to platform-level bugs.

### 2. League Results Missing
- Some leagues (e.g., NBA, Ligue 1, and La Liga) do not appear in search results.

### 3. Location Restriction
- Tests fail to run in CI/CD due to geographical restrictions on the EpicBet platform.

![alt text](image.png)

---

## Browser Compatibility
- **Chromium**: Best performance.
- **WebKit**: Increased rendering times; doubled timeout values for stability.
- **Mozilla**: Moderate performance.

---

## CI/CD Pipeline
The test suite integrates seamlessly with a GitHub Actions pipeline:
1. Installs Playwright dependencies and browsers.
2. Executes tests only for changed files.
3. Uploads test results in JUnit, JSON, and CTRF formats.
4. Notifies committers of test outcomes.

---

## Additional Remarks
- The current test suite is basic and focuses on core functionalities. Additional edge cases and exploratory testing are recommended.
- Tests were executed on multiple browsers to ensure compatibility and reliability.

