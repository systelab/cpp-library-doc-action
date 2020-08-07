import * as core from "@actions/core";

import { LogReporter } from "./log-reporter";
import { GitHubRelease } from "./github-release";


(async () =>
{

    try
    {
        const libraryName = core.getInput("library-name");
        const tagName = core.getInput("tag-name");
        const configurationName = core.getInput("configuration-name");
        const ciSystem = core.getInput("ci-system");
        const jobId = core.getInput("job-id");
        console.log(`Generating documentation for ${libraryName} ${tagName} - ${configurationName} (${ciSystem}/${jobId})`);
        console.log("");

        const logReportFilepath: string = await LogReporter.buildLogReportFile();
        await GitHubRelease.uploadAsset(logReportFilepath);
    }
    catch (error)
    {
        core.setFailed(error.message);
    }

})();
