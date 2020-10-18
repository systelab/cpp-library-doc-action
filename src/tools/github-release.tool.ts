import * as GitHub from "@actions/github";

import { Repository } from "@model";
import { FilesystemUtility } from "@utils";


export class GitHubRelease
{
    private static releaseInternalId: number;

    public static async existsAsset(repository: Repository, tag: string, name: string): Promise<boolean>
    {
        const assetNames: string[] = await this.getAssetNames(repository, tag);
        const found = assetNames.find((assetName) => assetName === name);
        return !!found;
    }

    public static async getAssetNames(repository: Repository, tag: string): Promise<string[]>
    {
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);

        if (!this.releaseInternalId)
        {
            this.releaseInternalId = await this.getReleaseAssetId(client, repository, tag);
        }

        console.log(`Querying assets from GitHub Release...`);
        const listAssetsResponse = await client.repos.listReleaseAssets({
            owner: repository.owner,
            repo: repository.slug,
            release_id: this.releaseInternalId
        });
        const assetNames = listAssetsResponse.data.map((asset) => asset.name);

        console.log("Assets queried successfully.");
        console.log("Asset names: ", assetNames);
        console.log("");

        return assetNames;
    }

    public static async uploadAsset(repository: Repository, tag: string, filepath: string): Promise<void>
    {
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);

        if (!this.releaseInternalId)
        {
            this.releaseInternalId = await this.getReleaseAssetId(client, repository, tag);
        }

        console.log(`Uploading '${FilesystemUtility.getFilename(filepath)}' asset to GitHub Release...`);
        const uploadAssetResponse = await client.repos.uploadReleaseAsset({
            owner: repository.owner,
            repo: repository.slug,
            release_id: this.releaseInternalId,
            name: FilesystemUtility.getFilename(filepath),
            data: FilesystemUtility.readFileBuffer(filepath)
        });
        console.log("Asset uploaded successfully.");
        console.log("");
    }

    public static async downloadAsset(repository: Repository, assetId: number): Promise<void>
    {
        console.log(`Downloading asset ${assetId} from GitHub Release...`);
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);
        const downloadAssetResponse = await client.repos.getReleaseAsset({
            owner: repository.owner,
            repo: repository.slug,
            asset_id: assetId
        });
        console.log("Asset downloaded successfully.");
        console.log("");
    }

    public static async deleteAsset(repository: Repository, assetId: number): Promise<void>
    {
        console.log(`Deleting asset ${assetId} from GitHub Release...`);
        const token: string = process.env.GITHUB_TOKEN as string;
        const client = GitHub.getOctokit(token);
        const deleteAssetResponse = await client.repos.deleteReleaseAsset({
            owner: repository.owner,
            repo: repository.slug,
            asset_id: assetId
        });
        console.log("Asset deleted successfully.");
        console.log("");
    }

    private static async getReleaseAssetId(client, repository: Repository, tag: string): Promise<number>
    {
        console.log("Querying for GitHub Release internal identifier...");
        const releaseDataResponse = await client.repos.getReleaseByTag({
            owner: repository.owner,
            repo: repository.slug,
            tag
        });

        const releaseInternalId = releaseDataResponse.data.id;
        console.log(`Internal release identifer for '${repository.owner}/${repository.slug}@${tag}' ` +
                    `is ${this.releaseInternalId}`);
        console.log("");

        return releaseInternalId;
    }
}
