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
        await this.cleanRepository(changelog.repository);
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

        await this.cleanRepository(changelog.repository);

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
        FilesystemUtility.createFolder(repoLocalPath);

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

    private static async cleanRepository(repository: Repository): Promise<void>
    {
        const repoLocalPath = this.getRepositoryLocalPath(repository);
        console.log(`Deleting '${repoLocalPath}' folder contents...`);
        FilesystemUtility.deleteFolder(repoLocalPath);
        console.log("Contents of folder deleted successfully.");
        console.log("");
    }

    private static getRepositoryLocalPath(repository: Repository): string
    {
        return `workspace/${repository.slug}`;
    }

    private static getReportTitle(changelog: ChangelogReport): string
    {
        return `${changelog.repository.name} change log report for ${this.getVersionName(changelog.tag)}`;
    }

    private static async getHTMLReportContent(changelog: ChangelogReport): Promise<string>
    {
        const changelogBase = changelog.baseTag ? `tag for ${this.getVersionName(changelog.baseTag)}` : "creation";
        let content = "<h1>1 Introduction</h1>" +
                      "<p class=\"last\">This report contains all commits " +
                      `for ${this.getVersionName(changelog.tag)} of "${changelog.repository.name}" repository ` +
                      `since ${changelogBase}.</p>`;

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

        const allTags = await this.gitClient.tags();
        const allTagsSorted = allTags["all"].sort((tagA, tagB) => this.compareTags(tagA, tagB));

        let insideTagsInterval = !changelog.baseTag;
        for (let tagIndex = 0; tagIndex < allTagsSorted.length; tagIndex++)
        {
            const currentTag = allTagsSorted[tagIndex];
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

        if (insideTagsInterval)
        {
            intermediateTags.push("HEAD");
        }

        return intermediateTags.reverse();
    }

    private static compareTags(tagA: string, tagB: string): number
    {
        const tagRegExp = /v\d+(.\d+)*/;
        if (!tagRegExp.test(tagA) || !tagRegExp.test(tagB))
        {
            return tagA.localeCompare(tagB);
        }

        // -1 -> A < B
        //  0 -> A == B
        // +1 -> A > B
        const itemsTagA: number[] = tagA.substr(1).split(".").map((value) => +value);
        const itemsTagB: number[] = tagB.substr(1).split(".").map((value) => +value);
        const minItemCount: number = (itemsTagA.length < itemsTagB.length) ? itemsTagA.length : itemsTagB.length;
        for (let itemIndex = 0; itemIndex < minItemCount; itemIndex++)
        {
            const itemTagA: number = itemsTagA[itemIndex];
            const itemTagB: number = itemsTagB[itemIndex];
            if (itemTagA < itemTagB)
            {
                return -1;
            }
            else if (itemTagA > itemTagB)
            {
                return 1;
            }
        }

        if (itemsTagA.length < itemsTagB.length)
        {
            return 1;
        }
        else if (itemsTagA.length > itemsTagB.length)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }

    private static async getHTMLReportTagSection(sectionId: number, repository: Repository, tag: string, baseTag: string): Promise<string>
    {
        let content = `<h1>${sectionId} Changes for ${this.getVersionName(tag)}</h1>`;

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

    private static getVersionName(tag: string): string
    {
        return (tag === "HEAD") ? "HEAD" : `version ${tag.substr(1)}`;
    }

    private static getSanitizedHTML(data: string): string
    {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    }
}
