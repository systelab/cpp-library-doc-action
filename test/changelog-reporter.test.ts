import { Repository, RepositoryType } from "@model";
import { ChangelogReporter } from "@reporters";


describe("ChangelogReporter", () =>
{
    it("Generate a PDF with the change log report of 'https://github.com/systelab/cpp-json-settings' repository " +
       "for version 'v1.3.0' since repository creation", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-json-settings",
            name: "C++ JSON Settings Library",
            url: "https://github.com/systelab/cpp-json-settings.git"
        };
        const tag = "v1.3.0";
        await ChangelogReporter.generateChangelogReportFile(repository, tag);
    });

    it("Generate a PDF with the change log report of 'https://github.com/systelab/cpp-json-settings' repository " +
       "for version 'v1.3.4' since tag 'v1.3.0'", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-json-settings",
            name: "C++ JSON Settings Library",
            url: "https://github.com/systelab/cpp-json-settings.git"
        };
        const tag = "v1.3.4";
        const baseTag = "v1.3.0";
        await ChangelogReporter.generateChangelogReportFile(repository, tag, baseTag);
    });

});
