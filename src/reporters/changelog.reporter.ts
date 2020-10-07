import simpleGit, { SimpleGit } from "simple-git";

import { ReleaseBuild, Repository } from "@model";
import { FilesystemUtility } from "@utils";
import { PDFReporter } from "./pdf.reporter";


export class ChangelogReporter
{
    static gitClient: SimpleGit = simpleGit();

    public static async generateChangelogReportFile(build: ReleaseBuild): Promise<string>
    {
        await this.cloneRepository(build.repository);

        const reportTitle = this.getReportTitle(build);
        const reportFilename =  this.getReportFilepath(build);
        const htmlReportContent = await this.getHTMLReportContent(build);

        await PDFReporter.generate(reportTitle, htmlReportContent, reportFilename);

        return reportFilename;
    }

    private static async cloneRepository(repository: Repository): Promise<void>
    {
        const repoLocalPath = this.getRepositoryLocalPath(repository);
        console.log(`Delete '${repoLocalPath}' folder...`);
        FilesystemUtility.deleteFolder(repoLocalPath);
        console.log("Folder deleted successfully.");

        console.log(`Cloning '${repository.url}' into '${repoLocalPath}' repository...`);
        const cloneResult = await this.gitClient.clone(repository.url, repoLocalPath);
        console.log("Clone result", cloneResult);
    }

    private static getRepositoryLocalPath(repository: Repository): string
    {
        return `./workspace/${repository.slug}`;
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
