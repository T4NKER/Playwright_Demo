const fs = require('fs');

function convertToCrtf(playwrightReport, outputFile) {
    const ctrfReport = {
        version: 1,
        results: [],
    };

    playwrightReport.suites.forEach((suite) => {
        suite.specs.forEach((spec) => {
            spec.tests.forEach((test) => {
                ctrfReport.results.push({
                    status: test.outcome === 'passed' ? 'success' : 'failure',
                    test: `${suite.title} > ${spec.title} > ${test.title}`,
                    details: test.error || 'No details',
                });
            });
        });
    });

    fs.writeFileSync(outputFile, JSON.stringify(ctrfReport, null, 2));
    console.log(`CTRF report written to ${outputFile}`);
}

const playwrightReport = JSON.parse(fs.readFileSync('results.json', 'utf8'));
convertToCrtf(playwrightReport, 'ctrf-results.json');
