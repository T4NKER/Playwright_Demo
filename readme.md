# Test Suite Overview

## Introduction
This test suite automates key functionalities of the EpicBet platform using Playwright. It ensures the reliability of search and betting functionalities across multiple environments.

## Table of Contents
- [Tests](#tests)
   - [Validate Search Functionality with Matches](#1-validate-search-functionality-with-dynamic-match-terms)
   - [Validate Search Functionality with Leagues](#2-validate-league-search-functionality)
   - [Invalid Search Terms](#3-invalid-search-terms)
   - [Betting](#4-betting)
- [Logger](#logger)
- [Known Issues](#known-issues)
- [Browser Compatibility](#browser-compatibility)
- [CI/CD Pipeline](#ci-cd-pipeline)
- [Additional Remarks](#additional-remarks)

---

## To run

You need playwright installed. To do this, use

```
npm install --save-dev @playwright/test

npx playwright test
```

## Tests

### 1. Validate Search Functionality with Dynamic Match Terms
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
- Inconsistencies in search results for specific matches (e.g., minor leagues).

---

### 2. Validate League Search Functionality
#### Objective
Ensure league names displayed on the homepage appear correctly in search results.

#### Steps
1. Fetch league names using the `getLeagues` helper function.
2. Open the search modal and input league names.
3. Validate search results against expected leagues.
4. Close the search modal.

#### Helpers Used
- `getLeagues(page, limit, logger)`
- `testSearchTerm(page, term, logger)`

#### Known Issues
- Certain leagues (e.g., NBA, Ligue 1, and La Liga) do not appear due to platform bugs.

---

### 3. Invalid Search Terms
#### Objective
Ensure invalid search terms (e.g., special characters, SQL injections) do not return any results.

#### Steps
1. Open the search modal.
2. Input invalid search terms (e.g., `DROP TABLE USERS`, excessively long strings).
3. Validate that no results are returned.
4. Close the search modal.

#### Helpers Used
- `testSearchTerm(page, term, logger)`

---


### 4. Betting
#### Objective
Validate betting functionality for spotlight matches and combobets.

#### Steps
1. Navigate to the main page.
2. Select spotlight matches or create a combobet.
3. Validate the betting input fields and betslip visibility.
4. Validate the appearance of the authentication modal.

#### Helpers Used
- `betWithSpotlight(page, logger)`
- `handleQuickBet(page, logger, amount)`
- `handleMultipleBets(page, logger, term)`
- `removeComboBet(page, logger, terms)`

---

## Logger
A custom logger is used for debugging and tracking test execution flow:
- Log Levels: `error`, `warn`, `info`, and `debug`.
- Default: `info` (configurable in `Logger` constructor).
- Usage: Logs are used extensively to debug search inconsistencies and validate test flow.
- This is especially useful when looking at the report in XML format as the logs are written there per test basis in a linear manner compared to the terminal.

---

## Known Issues
1. **League Results Missing**:
   - Popular leagues like NBA and La Liga occasionally fail to appear in search results.

2. **Location Restrictions**:
   - Tests may fail to run in CI/CD due to geographical restrictions on the EpicBet platform, but the workflow itself works.

---

## Browser Compatibility
- **Chromium**: Best performance and stability.
- **WebKit**: Increased rendering times; tests configured with longer timeouts.
- **Mozilla**: Moderate performance but functional.

---

## CI/CD Pipeline
### Workflow Highlights
1. Installs all dependencies, including browsers.
2. Detects changes and runs tests only for modified files.
3. Uploads detailed test results (JUnit, JSON, CTRF formats).
4. Notifies committers about test outcomes and adds comments to commits.
5. Generates workflow reports for debugging.

---

## Additional Remarks
- Future enhancements could include tests for authenticated user workflows and advanced betting scenarios.
- Browser-specific testing configurations are available but currently limited to Chromium for simplicity.
