import * as GitHub from "@actions/github";
import * as fs from "fs";
import * as path from "path";

import { ActionInput } from "./action-input";


export class GitHubRelease
{
    private static releaseInternalId: number;

    public static async uploadAsset(filepath: string): Promise<void>
    {
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);

        const repoOwner = ActionInput.getRepositoryOwner();
        const repoName = ActionInput.getRepositoryName();
        const tagName = ActionInput.getTagName();

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
        console.log("Asset uploaded successfully.");
        console.log("");
    }

    public static async downloadAsset(assetId: number): Promise<void>
    {
        const repoOwner = ActionInput.getRepositoryOwner();
        const repoName = ActionInput.getRepositoryName();

        console.log(`Downloading asset ${assetId} from GitHub Release...`);
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);
        const downloadAssetResponse = await client.repos.getReleaseAsset({
            owner: repoOwner,
            repo: repoName,
            asset_id: assetId
        });
        console.log("Asset downloaded successfully.");
        console.log("");
    }

    public static async deleteAsset(assetId: number): Promise<void>
    {
        const repoOwner = ActionInput.getRepositoryOwner();
        const repoName = ActionInput.getRepositoryName();

        console.log(`Deleting asset ${assetId} from GitHub Release...`);
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);
        const deleteAssetResponse = await client.repos.deleteReleaseAsset({
            owner: repoOwner,
            repo: repoName,
            asset_id: assetId
        });
        console.log("Asset deleted successfully.");
        console.log("");
    }

}
