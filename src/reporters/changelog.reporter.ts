import simpleGit, { SimpleGit } from "simple-git";

import { Repository } from "@model";
import { FilesystemUtility } from "@utils";
import { PDFReporter } from "./pdf.reporter";


export class ChangelogReporter
{
    static gitClient: SimpleGit = simpleGit();

    public static async generateChangelogReportFile(repository: Repository, tag: string): Promise<string>
    {
        await this.cloneRepository(repository);

        const reportTitle = this.getReportTitle(repository, tag);
        const reportFilename =  this.getReportFilepath(repository, tag);
        const htmlReportContent = await this.getHTMLReportContent(repository, tag);

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

    private static getReportTitle(repository: Repository, tag: string): string
    {
        return `${repository.name} change log report for version ${tag}`;
    }

    private static getReportFilepath(repository: Repository, tag: string): string
    {
        return `report/${repository.slug}-${tag}-Changelog.pdf`;
    }

    private static async getHTMLReportContent(repository: Repository, tag: string): Promise<string>
    {
        // const options: GitlogOptions = {
        //     repo: ActionInput.getRepositoryName(),
        //     fields: ["subject", "authorName", "authorDate"] as const,
        // };
        // const entries = gitlog(options);

        return "TODO";
    }
}
