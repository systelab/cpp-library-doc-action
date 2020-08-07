import * as core from "@actions/core";
import * as GitHub from "@actions/github";
import * as fs from "fs";

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
        fs.writeFileSync(`${libraryName}-${tagName}-${configurationName}-BuildLog.txt`, buildLog);
        console.log("Build log file generated successfully");

        // Upload build log as a release asset
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);

        const releaseData = await client.repos.getReleaseByTag({
            owner: repoOwner,
            repo: repoName,
            tag: tagName
        });

        console.log("Data of release to upload asset:");
        console.log(releaseData);

        const uploadAssetResponse = await client.repos.uploadReleaseAsset({
            owner: repoOwner,
            repo: repoName,
            release_id: releaseData.data.id,
            name: buildLogFilename,
            data: fs.readFileSync(buildLogFilename)
        });

        console.log("After uploading asset:");
        console.log(uploadAssetResponse);
    }
    catch (error)
    {
        core.setFailed(error.message);
    }

})();
