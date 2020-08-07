import * as core from "@actions/core";
import * as fs from "fs";

import { GitHubRelease } from "./github-release";


(async () =>
{

    try
    {
        const repoOwner = core.getInput("owner");
        const repoName = core.getInput("repo-name");
        const libraryName = core.getInput("library-name");
        const tagName = core.getInput("tag-name");
        const configurationName = core.getInput("configuration-name");
        const ciSystem = core.getInput("ci-system");
        const jobId = core.getInput("job-id");
        console.log(`Generating documentation for ${libraryName} ${tagName} - ${configurationName} (${ciSystem}/${jobId})`);

        // Generate build log file
        const buildLogFilename = `${libraryName}-${tagName}-${configurationName}-BuildLog.txt`;
        const buildLog = "This is the build log gathered from AppVeyor";
        fs.writeFileSync(buildLogFilename, buildLog);
        console.log("Build log file generated successfully");

        // Generate build log file 2
        const buildLogFilename2 = `${libraryName}-${tagName}-${configurationName}-BuildLog2.txt`;
        const buildLog2 = "This is the build log gathered from Travis";
        fs.writeFileSync(buildLogFilename2, buildLog2);
        console.log("Build log 2 file generated successfully");

        // Upload build logs as a release assets
        await GitHubRelease.uploadAsset(buildLogFilename, buildLogFilename);
        await GitHubRelease.uploadAsset(buildLogFilename2, buildLogFilename2);
    }
    catch (error)
    {
        core.setFailed(error.message);
    }

})();
