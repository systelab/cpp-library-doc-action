import { Repository, RepositoryType, ReleaseBuild } from "@model";
import { GitHubRelease } from "@tools";


describe("GitHubRelease", () =>
{
    it("Query assets for release 'v1.3.0' of 'TraceAPI CSW library' repository", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-trace-api",
            name: "TraceAPI CSW library",
            url: "https://github.com/systelab/cpp-trace-api.git"
        };
        const names = await GitHubRelease.getAssetNames(repository, "v1.3.0");
        console.log("Release assets:", names);
    });

    it("Check if asset 'TraceAPITest-724859523.xml' exists on release 'v1.3.0' of 'TraceAPI CSW library' repository", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-trace-api",
            name: "TraceAPI CSW library",
            url: "https://github.com/systelab/cpp-trace-api.git"
        };
        const exists = await GitHubRelease.existsAsset(repository, "v1.3.0", "TraceAPITest-724859523.xml");
        console.log("Asset 'TraceAPITest-724859523.xml' exists:", exists);
    });

    it("Check if asset 'NotExisting.xml' exists on release 'v1.3.0' of 'TraceAPI CSW library' repository", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-trace-api",
            name: "TraceAPI CSW library",
            url: "https://github.com/systelab/cpp-trace-api.git"
        };
        const exists = await GitHubRelease.existsAsset(repository, "v1.3.0", "NotExisting.xml");
        console.log("Asset 'NotExisting.xml' exists:", exists);
    });

});
