import { Repository, RepositoryType } from "@model";
import { ChangelogReporter } from "@reporters";


describe("ChangelogReporter", () =>
{
    it("Generate a PDF with the change log report of 'https://github.com/systelab/cpp-json-settings' repository for tag 'v1.3.4'", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-json-settings",
            name: "C++ JSON Settings Library",
            url: "https://github.com/systelab/cpp-json-settings.git"
        };
        const tag = "v1.3.4";
        await ChangelogReporter.generateChangelogReportFile(repository, tag);
    });

    it("Generate a PDF with the change log report of 'https://bitbucket.org/Systelab/cpp-anti-debug' repository for tag 'v1.0.3'", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.Bitbucket,
            owner: "Systelab",
            slug: "cpp-anti-debug",
            name: "C++ AntiDebug Library",
            url: "https://bitbucket.org/Systelab/cpp-anti-debug.git"
        };
        const tag = "v1.0.3";
        await ChangelogReporter.generateChangelogReportFile(repository, tag);
    });
});
