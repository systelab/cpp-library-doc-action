import { ContinuousIntegrationSystem, ReleaseBuild, RepositoryType } from "@model";
import { ChangelogReporter } from "@reporters";


describe("ChangelogReporter", () =>
{
    it("Generate a PDF with the change log report of 'https://github.com/systelab/cpp-json-settings' repository for tag 'v1.3.4'", async () =>
    {
        const build: ReleaseBuild = {
            repository: {
                type: RepositoryType.GitHub,
                owner: "systelab",
                slug: "cpp-json-settings",
                name: "C++ JSON Settings Library",
                url: "https://github.com/systelab/cpp-json-settings"
            },
            tag: "v1.3.4",
            configuration: "",
            ciSystem: ContinuousIntegrationSystem.AppVeyor,
            jobId: ""
        };

        await ChangelogReporter.generateChangelogReportFile(build);
    });

});
