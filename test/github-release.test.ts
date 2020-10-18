import { Repository, RepositoryType, ReleaseBuild } from "@model";
import { GitHubRelease } from "@tools";


describe("GitHubRelease", () =>
{
    it("Query assets for release 'v1.0.1' of 'JSONSettings CSW library' repository", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-json-settings",
            name: "JSONSettings CSW library",
            url: "https://github.com/systelab/cpp-json-settings.git"
        };
        const names = await GitHubRelease.getAssetNames(repository, "1.3.0");
        console.log("Release assets:", names);
    });

});
