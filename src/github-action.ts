import { PDFDocument, ReleaseBuild } from "@model";
import { BuildlogReporter, ReleaseNotesReporter } from "@reporters";
import { GitHubAction, GitHubRelease } from "@tools";


describe("Automated documentation GitHub action", () =>
{
    let build: ReleaseBuild;
    let buildLogReportFilepath: string;
    let releaseNotesFilepath: string;

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
        buildLogReportFilepath = pdfDocument.filepath;
    });

    it("Generate release notes report PDF", async () =>
    {
        const pdfDocument: PDFDocument = await ReleaseNotesReporter.generateReport({
            repository: build.repository,
            version: build.tag.substr(1)
        });
        releaseNotesFilepath = pdfDocument.filepath;
    });

    it("Upload reports as GitHub release assets", async () =>
    {
        await GitHubRelease.uploadAsset(build, buildLogReportFilepath);
        await GitHubRelease.uploadAsset(build, releaseNotesFilepath);
    });

});
