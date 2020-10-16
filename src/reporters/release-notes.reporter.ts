import simpleGit, { SimpleGit } from "simple-git";
import * as showdown from "showdown";

import { PDFDocument, ReleaseNotesReport, Repository } from "@model";
import { DateUtility, FilesystemUtility } from "@utils";

import { PDFReporter } from "./pdf.reporter";


export class ReleaseNotesReporter
{
    static gitClient: SimpleGit;

    public static async generateReport(releaseNotes: ReleaseNotesReport): Promise<PDFDocument>
    {
        await this.cleanRepository(releaseNotes.repository);
        await this.cloneRepository(releaseNotes.repository);

        const reportFilepath =  this.getReportFilepath(releaseNotes);
        const reportTitle = this.getReportTitle(releaseNotes);
        const reportDate = DateUtility.getCurrrentDateForHeader();

        const htmlReportContent = await this.getHTMLReportContent(releaseNotes);

        const pdfDocument: PDFDocument = {
            filepath: reportFilepath,
            title: reportTitle,
            version: releaseNotes.documentVersion,
            status: releaseNotes.status,
            date: reportDate,
            code: releaseNotes.code,
            content: htmlReportContent,
        };
        await PDFReporter.generate(pdfDocument);

        await this.cleanRepository(releaseNotes.repository);

        return pdfDocument;
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

    private static getReportFilepath(releaseNotes: ReleaseNotesReport): string
    {
        if (releaseNotes.filepath)
        {
            return releaseNotes.filepath;
        }
        else
        {
            return `report/${releaseNotes.repository.slug}-${releaseNotes.version}-ReleaseNotes.pdf`;
        }
    }

    private static getReportTitle(releaseNotes: ReleaseNotesReport): string
    {
        return `Release notes for ${releaseNotes.repository.name} version ${releaseNotes.version}`;
    }

    private static getHTMLReportContent(releaseNotes: ReleaseNotesReport): string
    {
        const introductionHTML = `<h1>Introduction</h1>` +
                                 `<p>This document contains the release note for version ${releaseNotes.version} of ` +
                                 `the ${releaseNotes.repository.name}.</p>`;

        const contentMarkdown: string = this.getMarkdownContent(releaseNotes);
        const contentHTML: string = this.convertMarkdownToHTML(contentMarkdown);

        return `${introductionHTML} ${contentHTML}`;
    }

    private static getMarkdownContent(releaseNotes: ReleaseNotesReport): string
    {
        const repoLocalPath = this.getRepositoryLocalPath(releaseNotes.repository);
        const markdownRelativePath = releaseNotes.markdownPath ? releaseNotes.markdownPath : "RELEASENOTES.md";
        const releaseNoteMarkdownFilepath = `${repoLocalPath}/${markdownRelativePath}`;
        return FilesystemUtility.readFile(releaseNoteMarkdownFilepath);
    }

    private static convertMarkdownToHTML(contentMarkdown: string): string
    {
        const converter = new showdown.Converter();
        return converter.makeHtml(contentMarkdown);
    }
}
