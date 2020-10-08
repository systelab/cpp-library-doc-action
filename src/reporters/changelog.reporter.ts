import simpleGit, { SimpleGit } from "simple-git";
import gitlog, { GitlogOptions } from "gitlog";

import { Repository } from "@model";
import { FilesystemUtility } from "@utils";
import { PDFReporter } from "./pdf.reporter";


export class ChangelogReporter
{
    static gitClient: SimpleGit;

    public static async generateChangelogReportFile(repository: Repository, tag: string, baseTag?: string): Promise<string>
    {
        await this.cloneRepository(repository);

        const reportTitle = this.getReportTitle(repository, tag);
        const reportFilename =  this.getReportFilepath(repository, tag);
        const htmlReportContent = await this.getHTMLReportContent(repository, tag, baseTag);

        await PDFReporter.generate(reportTitle, htmlReportContent, reportFilename);

        return reportFilename;
    }

    private static async cloneRepository(repository: Repository): Promise<void>
    {
        const repoLocalPath = this.getRepositoryLocalPath(repository);
        console.log(`Deleting '${repoLocalPath}' folder contents...`);
        FilesystemUtility.deleteFolder(repoLocalPath);
        FilesystemUtility.createFolder(repoLocalPath);
        console.log("Contents of folder deleted successfully.");
        console.log("");

        this.gitClient = simpleGit({
            baseDir: `${process.cwd()}/${repoLocalPath}`,
            binary: "git",
            maxConcurrentProcesses: 6,
        });

        console.log(`Cloning '${repository.url}' into '${repoLocalPath}' repository...`);
        await this.gitClient.clone(repository.url, ".");
        console.log("Repository cloned successfully.");
        console.log("");
    }

    private static getRepositoryLocalPath(repository: Repository): string
    {
        return `workspace/${repository.slug}`;
    }

    private static getReportTitle(repository: Repository, tag: string): string
    {
        return `${repository.name} change log report for version ${tag}`;
    }

    private static getReportFilepath(repository: Repository, tag: string): string
    {
        return `report/${repository.slug}-${tag}-Changelog.pdf`;
    }

    private static async getHTMLReportContent(repository: Repository, tag: string, baseTag: string): Promise<string>
    {
        const changelogBase = baseTag ? `tag for version ${baseTag.substr(1)}` : "repository creation";
        let content = "<h1>1 Introduction</h1>" +
                      `<p class="last">This report contains all commits for version ${tag.substr(1)} of ${repository.name} since ${changelogBase}.</p>`;

        let sectionId = 2;
        const intermediateTags: string[] = await this.getIntermediateTags(tag, baseTag);
        for (let tagIndex = 0; tagIndex < intermediateTags.length; tagIndex++)
        {
            const currentTag =  intermediateTags[tagIndex];
            const previousTag = (tagIndex < intermediateTags.length - 1) ? intermediateTags[tagIndex + 1] : baseTag;
            content += await this.getHTMLReportTagSection(sectionId, repository, currentTag, previousTag);
            sectionId++;
        }

        return content;
    }

    private static async getIntermediateTags(tag: string, baseTag: string): Promise<string[]>
    {
        const intermediateTags: string[] = [];

        let insideTagsInterval = !baseTag;
        const allTags = await this.gitClient.tags();
        for (let tagIndex = 0; tagIndex < allTags["all"].length; tagIndex++)
        {
            const currentTag = allTags["all"][tagIndex];
            if (insideTagsInterval)
            {
                intermediateTags.push(currentTag);
            }

            if (currentTag === baseTag)
            {
                insideTagsInterval = true;
            }
            else if (currentTag === tag)
            {
                insideTagsInterval = false;
            }
        }

        return intermediateTags.reverse();
    }

    private static async getHTMLReportTagSection(sectionId: number, repository: Repository, tag: string, baseTag: string): Promise<string>
    {
        let content = `<h1>${sectionId} Changes for ${tag}</h1>`;

        const logOptions = {
            repo: this.getRepositoryLocalPath(repository),
            fields: ["authorName", "authorDate", "hash", "rawBody"] as const,
            branch: await this.getRevisionRange(tag, baseTag),
            number: 10000000
        };

        const commits = await gitlog(logOptions);
        for (const commit of commits)
        {
            content += `<div class="commit-item">`;
            content += `<b>${commit.authorDate} - ${commit.authorName}</b><br>`;
            content += `${commit.hash}: ${this.getSanitizedHTML(commit.rawBody)}<br><br>`;
            content += `</diV>`;
        }

        return content;
    }

    private static async getRevisionRange(tag: string, previousTag: string): Promise<string>
    {
        if (previousTag && (previousTag.length > 0))
        {
            return `${previousTag}...${tag}`;
        }
        else
        {
            return tag;
        }
    }

    private static getSanitizedHTML(data: string): string
    {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    }
}
