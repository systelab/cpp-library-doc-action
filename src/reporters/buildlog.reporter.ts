import { ContinuousIntegrationSystem, PDFDocument, ReleaseBuild } from "@model";
import { AppVeyor, Travis } from "@tools";
import { DateUtility } from "@utils";

import { PDFReporter } from "./pdf.reporter";


export class BuildlogReporter
{
    public static async generateBuildlogReportFile(build: ReleaseBuild): Promise<PDFDocument>
    {
        const reportFilepath =  this.getLogReportFilepath(build);
        const reportTitle = this.getReportTitle(build);
        const reportDate = DateUtility.getCurrrentDateForHeader();

        const logContent: string = await this.getJobLog(build);
        const htmlReportContent = this.getHTMLReportContent(build, logContent);

        const pdfDocument: PDFDocument = {
            filepath: reportFilepath,
            title: reportTitle,
            date: reportDate,
            content: htmlReportContent,
        };
        await PDFReporter.generate(pdfDocument);

        return pdfDocument;
    }

    private static getReportTitle(build: ReleaseBuild): string
    {
        return `${build.repository.name} compilation memo for version ${build.tag}`;
    }

    private static async getJobLog(build: ReleaseBuild): Promise<string>
    {
        switch (build.ciSystem)
        {
            case ContinuousIntegrationSystem.AppVeyor:
                return AppVeyor.getJobLog(build.jobId);

            case ContinuousIntegrationSystem.Travis:
                return Travis.getJobLog(build.jobId);

            default:
                throw Error("Unsupported continuous integration system");
        }
    }

    private static getLogReportFilepath(build: ReleaseBuild): string
    {
        return `report/${build.repository.name}-${build.tag}-${build.configuration}-Compilation Memo.pdf`;
    }

    private static getHTMLReportContent(build: ReleaseBuild, logContent: string): string
    {
        let logContentHTML = "";
        const logContentLines = logContent.split(/\r\n|\n|\r/);
        for (const logLine of logContentLines)
        {
            logContentHTML += `<div class="log-line">${logLine}</div>`;
        }

        return `<h1>Introduction</h1>` +
               `<p>${build.repository.name} version ${build.tag} was built on ${DateUtility.getCurrrentDateForContent()} for ` +
               `the "${build.configuration}" configuration.</p>` +
               `<h1>Log</h1>` +
               `<div>${logContentHTML}</div>`;
    }
}
