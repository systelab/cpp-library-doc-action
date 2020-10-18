import { PDFDocument, ReleaseBuild } from "@model";
import { BuildlogReporter, ReleaseNotesReporter, ChangelogReporter } from "@reporters";
import { GitHubAction, GitHubRelease } from "@tools";


describe("Automated documentation GitHub action", () =>
{
    let build: ReleaseBuild;
    let buildLogReportFilepath: string;
    let releaseNotesFilepath: string;
    let changeLogFilepath: string;

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

    it("Upload build log as GitHub release asset", async () =>
    {
        await GitHubRelease.uploadAsset(build, buildLogReportFilepath);
    });

    it("Generate release notes report PDF", async () =>
    {
        const pdfDocument: PDFDocument = await ReleaseNotesReporter.generateReport({
            repository: build.repository,
            version: build.tag.substr(1)
        });
        releaseNotesFilepath = pdfDocument.filepath;
    });

    it("Upload release notes as GitHub release asset", async () =>
    {
        if (!await GitHubRelease.existsAsset(build, releaseNotesFilepath))
        {
            await GitHubRelease.uploadAsset(build, releaseNotesFilepath);
        }
    });

    it("Generate changelog report PDF", async () =>
    {
        const pdfDocument: PDFDocument = await ChangelogReporter.generateReport({
            repository: build.repository,
            tag: build.tag
        });
        changeLogFilepath = pdfDocument.filepath;
    });

    it("Upload changelog as GitHub release asset", async () =>
    {
        if (!await GitHubRelease.existsAsset(build, changeLogFilepath))
        {
            await GitHubRelease.uploadAsset(build, changeLogFilepath);
        }
    });

});
