import { BuildlogReport, ContinuousIntegrationSystem, ReleaseBuild, Repository, RepositoryType } from "@model";
import { BuildlogReporter } from "@reporters";


describe("BuildlogReporter", () =>
{
    it("Generate a PDF with the change log report of 'https://github.com/systelab/cpp-json-settings' repository " +
       "for version 'v1.3.0' since repository creation", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-trace-api",
            name: "C++ Trace API Library",
            url: "https://github.com/systelab/cpp-trace-api.git"
        };
        const buildlogReport: BuildlogReport = {
            repository,
            tag: "v1.0.4",
            configuration: "Visual Studio 2017 Win32 Release",
            ciSystem: ContinuousIntegrationSystem.AppVeyor,
            jobId: "04qt9dlcisd8mqqc"
        };
        await BuildlogReporter.generateReport(buildlogReport);
    });
});
