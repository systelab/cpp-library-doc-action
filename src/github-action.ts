import { PDFDocument, ReleaseBuild } from "@model";
import { BuildlogReporter } from "@reporters";
import { GitHubAction, GitHubRelease } from "@tools";


describe("Automated documentation GitHub action", () =>
{
    let build: ReleaseBuild;
    let buildlogReportFilepath: string;

    before(async () =>
    {
        build = GitHubAction.getCurrentReleaseBuild();
        console.log(`Generating documentation for ${build.repository.name} ${build.tag} - ` +
                    `${build.configuration} (${build.ciSystem}/${build.jobId})`);
        console.log("");
    });

    it("Generate build log report PDF", async () =>
    {
        const pdfDocument: PDFDocument = await BuildlogReporter.generateBuildlogReportFile(build);
        buildlogReportFilepath = pdfDocument.filepath;
    });

    it("Upload build log report as a GitHub release asset", async () =>
    {
        await GitHubRelease.uploadAsset(build, buildlogReportFilepath);
    });
});
