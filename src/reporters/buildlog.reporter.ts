import { BuildlogReport, ContinuousIntegrationSystem, PDFDocument } from "@model";
import { AppVeyor, Jenkins, Travis } from "@tools";
import { DateUtility } from "@utils";

import { PDFReporter } from "./pdf.reporter";


export class BuildlogReporter
{
    public static async generateReport(buildlog: BuildlogReport): Promise<PDFDocument>
    {
        const reportFilepath =  this.getReportFilepath(buildlog);
        const reportTitle = this.getReportTitle(buildlog);
        const reportDate = DateUtility.getCurrrentDateForHeader();

        const htmlReportContent = await this.getHTMLReportContent(buildlog);

        const pdfDocument: PDFDocument = {
            filepath: reportFilepath,
            title: reportTitle,
            version: buildlog.version,
            status: buildlog.status,
            date: reportDate,
            code: buildlog.code,
            content: htmlReportContent,
        };
        await PDFReporter.generate(pdfDocument);

        return pdfDocument;
    }

    private static getReportFilepath(buildlog: BuildlogReport): string
    {
        if (buildlog.filepath)
        {
            return buildlog.filepath;
        }
        else
        {
            return `report/${buildlog.repository.slug}-${buildlog.tag}-${buildlog.configuration}-Compilation Memo.pdf`;
        }
    }

    private static getReportTitle(buildlog: BuildlogReport): string
    {
        return `Compilation memo for ${buildlog.repository.name} version ${buildlog.tag.substr(1)}`;
    }

    private static async getHTMLReportContent(buildlog: BuildlogReport): Promise<string>
    {
        const logContent: string = await this.getJobLog(buildlog);
        const logContentLines: string[] = logContent.split(/\r\n|\n|\r/);

        let logContentHTML = "";
        for (const logLine of logContentLines)
        {
            logContentHTML += `<div class="log-line">${logLine}</div>`;
        }

        return `<h1>Introduction</h1>` +
               `<p>${buildlog.repository.name} version ${buildlog.tag.substr(1)} was built on ${DateUtility.getCurrrentDateForContent()} for ` +
               `the "${buildlog.configuration}" configuration.</p>` +
               `<h1>Log</h1>` +
               `<div>${logContentHTML}</div>`;
    }

    private static async getJobLog(buildlog: BuildlogReport): Promise<string>
    {
        switch (buildlog.ciSystem)
        {
            case ContinuousIntegrationSystem.AppVeyor:
                return AppVeyor.getJobLog(buildlog.jobId);

            case ContinuousIntegrationSystem.Travis:
                return Travis.getJobLog(buildlog.jobId);

            case ContinuousIntegrationSystem.Jenkins:
                return Jenkins.getJobLog(buildlog.jobId);

            default:
                throw Error("Unsupported continuous integration system");
        }
    }


}
