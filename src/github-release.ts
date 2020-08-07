import * as core from "@actions/core";
import * as GitHub from "@actions/github";
import * as fs from "fs";
import * as path from "path";


export class GitHubRelease
{
    private static releaseInternalId: number;

    public static async uploadAsset(filepath: string): Promise<void>
    {
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);

        const repoOwner = core.getInput("owner");
        const repoName = core.getInput("repo-name");
        const tagName = core.getInput("tag-name");

        if (!this.releaseInternalId)
        {
            console.log("Querying for GitHub Release internal identifier...");
            const releaseDataResponse = await client.repos.getReleaseByTag({
                owner: repoOwner,
                repo: repoName,
                tag: tagName
            });

            this.releaseInternalId = releaseDataResponse.data.id;
            console.log(`Internal release identifer for '${repoOwner}/${repoName}@${tagName}' is ${this.releaseInternalId}`);
            console.log("");
        }

        console.log(`Uploading '${path.basename(filepath)}' asset to GitHub Release...`);
        const uploadAssetResponse = await client.repos.uploadReleaseAsset({
            owner: repoOwner,
            repo: repoName,
            release_id: this.releaseInternalId,
            name: path.basename(filepath),
            data: fs.readFileSync(filepath)
        });
        console.log("Asset uploaded successfully ");
        console.log("");
    }
}
