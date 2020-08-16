import * as core from "@actions/core";
import * as fs from "fs";

import { AppVeyor } from "./appveyor";
import { Travis } from "./travis";
import { PDFReport } from "./pdf-report";


export class LogReporter
{
    public static async buildLogReportFile(): Promise<string>
    {
        const reportTitle = this.getReportTitle();
        const logContent: string = await this.getJobLog();
        const reportFilename =  this.getLogReportFilepath();
        const htmlReportContent = this.getHTMLReportContent(logContent);

        await PDFReport.generate(reportTitle, htmlReportContent, reportFilename);

        return reportFilename;
    }

    private static getReportTitle(): string
    {
        const libraryName = core.getInput("library-name");
        const tagName = core.getInput("tag-name");
        return `${libraryName} compilation memo for version ${tagName}`;
    }

    private static async getJobLog(): Promise<string>
    {
        const ciSystem = core.getInput("ci-system");
        const jobId = core.getInput("job-id");

        if (ciSystem === "AppVeyor")
        {
            return AppVeyor.getJobLog(jobId);
        }
        else if (ciSystem === "Travis")
        {
            return Travis.getJobLog(jobId);
        }
        else
        {
            throw Error("Unsupported continuous integration system");
        }
    }

    private static getLogReportFilepath(): string
    {
        const libraryName = core.getInput("library-name");
        const tagName = core.getInput("tag-name");
        const configurationName = core.getInput("configuration-name");

        return `${libraryName}-${tagName}-${configurationName}-BuildLog.log`;
    }

    private static getHTMLReportContent(logContent: string): string
    {
        const libraryName = core.getInput("library-name");
        const tagName = core.getInput("tag-name");
        const configurationName = core.getInput("configuration-name");

        let logContentHTML = "";
        const logContentLines = logContent.split(/\r\n|\n|\r/);
        for (const logLine of logContentLines)
        {
            logContentHTML += `<div class="log-line">${logLine}</div>`;
        }

        return `<h1>1 Introduction</h1>
                <p class="last">${libraryName} version ${tagName} was built on August 8th, 2020 for the "${configurationName}" configuration.</p>
                <h1>2 Log</h1>
                <div>${logContentHTML}</div>`;
    }
}
