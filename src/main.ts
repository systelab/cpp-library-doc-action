import * as core from "@actions/core";

import { ActionInput } from "./action-input";
import { LogReporter } from "./log-reporter";
import { GitHubRelease } from "./github-release";


(async () =>
{

    try
    {
        const libraryName = ActionInput.getLibraryName();
        const tagName = ActionInput.getTagName();
        const configurationName = ActionInput.getConfigurationName();
        const ciSystem = ActionInput.getCISystem();
        const jobId = ActionInput.getJobId();

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
