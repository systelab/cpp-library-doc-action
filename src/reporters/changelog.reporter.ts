import { ReleaseBuild } from "@model";
import { PDFReporter } from "./pdf.reporter";


export class ChangelogReporter
{
    public static async generateChangelogReportFile(build: ReleaseBuild): Promise<string>
    {
        const reportTitle = this.getReportTitle(build);
        const reportFilename =  this.getReportFilepath(build);
        const htmlReportContent = await this.getHTMLReportContent(build);

        await PDFReporter.generate(reportTitle, htmlReportContent, reportFilename);

        return reportFilename;
    }

    private static getReportTitle(build: ReleaseBuild): string
    {
        return `${build.repository.name} change log report for version ${build.tag}`;
    }

    private static getReportFilepath(build: ReleaseBuild): string
    {
        return `report/${build.repository.slug}-${build.tag}-Changelog.pdf`;
    }

    private static async getHTMLReportContent(build: ReleaseBuild): Promise<string>
    {
        // const options: GitlogOptions = {
        //     repo: ActionInput.getRepositoryName(),
        //     fields: ["subject", "authorName", "authorDate"] as const,
        // };
        // const entries = gitlog(options);

        return "TODO";
    }
}
