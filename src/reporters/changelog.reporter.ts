import simpleGit, { SimpleGit } from "simple-git";
import gitlog, { GitlogOptions } from "gitlog";

import { ChangelogReport, PDFDocument, Repository } from "@model";
import { DateUtility, FilesystemUtility } from "@utils";
import { PDFReporter } from "./pdf.reporter";


export class ChangelogReporter
{
    static gitClient: SimpleGit;

    public static async generateReport(changelog: ChangelogReport): Promise<PDFDocument>
    {
        await this.cloneRepository(changelog.repository);

        const reportFilepath =  this.getReportFilepath(changelog);
        const reportTitle = this.getReportTitle(changelog);
        const reportDate = DateUtility.getCurrrentDateForHeader();

        const htmlReportContent = await this.getHTMLReportContent(changelog);

        const pdfDocument: PDFDocument = {
            filepath: reportFilepath,
            title: reportTitle,
            version: changelog.version,
            status: changelog.status,
            date: reportDate,
            code: changelog.code,
            content: htmlReportContent,
        };
        await PDFReporter.generate(pdfDocument);

        return pdfDocument;
    }

    private static getReportFilepath(changelog: ChangelogReport): string
    {
        if (changelog.filepath)
        {
            return changelog.filepath;
        }
        else
        {
            return `report/${changelog.repository.slug}-${changelog.tag}-Changelog.pdf`;
        }
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

    private static getReportTitle(changelog: ChangelogReport): string
    {
        return `${changelog.repository.name} change log report for version ${changelog.tag}`;
    }

    private static async getHTMLReportContent(changelog: ChangelogReport): Promise<string>
    {
        const changelogBase = changelog.baseTag ? `tag for version ${changelog.baseTag.substr(1)}` : "repository creation";
        let content = "<h1>1 Introduction</h1>" +
                      "<p class=\"last\">This report contains all commits " +
                      `for version ${changelog.tag.substr(1)} of ${changelog.repository.name} since ${changelogBase}.</p>`;

        let sectionId = 2;
        const intermediateTags: string[] = await this.getIntermediateTags(changelog);
        for (let tagIndex = 0; tagIndex < intermediateTags.length; tagIndex++)
        {
            const currentTag =  intermediateTags[tagIndex];
            const previousTag = (tagIndex < intermediateTags.length - 1) ? intermediateTags[tagIndex + 1] : changelog.baseTag;
            content += await this.getHTMLReportTagSection(sectionId, changelog.repository, currentTag, previousTag);
            sectionId++;
        }

        return content;
    }

    private static async getIntermediateTags(changelog: ChangelogReport): Promise<string[]>
    {
        const intermediateTags: string[] = [];

        let insideTagsInterval = !changelog.baseTag;
        const allTags = await this.gitClient.tags();
        for (let tagIndex = 0; tagIndex < allTags["all"].length; tagIndex++)
        {
            const currentTag = allTags["all"][tagIndex];
            if (insideTagsInterval)
            {
                intermediateTags.push(currentTag);
            }

            if (currentTag === changelog.baseTag)
            {
                insideTagsInterval = true;
            }
            else if (currentTag === changelog.tag)
            {
                insideTagsInterval = false;
            }
        }

        return intermediateTags.reverse();
    }

    private static async getHTMLReportTagSection(sectionId: number, repository: Repository, tag: string, baseTag: string): Promise<string>
    {
        let content = `<h1>${sectionId} Changes for version ${tag.substr(1)}</h1>`;

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
