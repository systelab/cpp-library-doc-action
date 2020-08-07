const core = require("@actions/core");
const github = require("@actions/github");

try
{
    const libraryName = core.getInput("library-name");
    const tagName = core.getInput("tag-name");
    const configurationName = core.getInput("configuration-name");
    const ciSystem = core.getInput("ci-system");
    const jobId = core.getInput("job-id");
    console.log(`Generating documentation for ${libraryName} ${tagName} - ${configurationName} (${ciSystem}/${jobId})`);

    // TODO: Get log from travis or appveyor
}
catch (error)
{
    core.setFailed(error.message);
}
