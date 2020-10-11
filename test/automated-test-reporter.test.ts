import { AutomatedTestReport, Repository, RepositoryType } from "@model";
import { AutomatedTestReporter } from "@reporters";


describe("AutomatedTestReporter", () =>
{
    it("Generate a PDF", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-trace-api",
            name: "C++ Trace API Library",
            url: "https://github.com/systelab/cpp-trace-api.git"
        };
        const automatedTestReport: AutomatedTestReport = {
            repository,
            tag: "v1.0.4",
            configuration: "Visual Studio 2017 Win32 Release",
            xmlFiles: [
                "resources/test-results1.xml"
            ]
        };
        await AutomatedTestReporter.generateReport(automatedTestReport);
    });
});
