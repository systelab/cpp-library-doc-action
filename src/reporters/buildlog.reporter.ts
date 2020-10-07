import { ContinuousIntegrationSystem, ReleaseBuild } from "@model";
import { AppVeyor, Travis } from "@tools";
import { PDFReporter } from "./pdf.reporter";


export class BuildlogReporter
{
    public static async generateBuildlogReportFile(build: ReleaseBuild): Promise<string>
    {
        const reportTitle = this.getReportTitle(build);
        const logContent: string = await this.getJobLog(build);
        const reportFilename =  this.getLogReportFilepath(build);
        const htmlReportContent = this.getHTMLReportContent(build, logContent);

        await PDFReporter.generate(reportTitle, htmlReportContent, reportFilename);

        return reportFilename;
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

        return `<h1>1 Introduction</h1>` +
               `<p class="last">${build.repository.name} version ${build.tag} was built on ${this.getCurrrentDate()} for ` +
               `the "${build.configuration}" configuration.</p>` +
               `<h1>2 Log</h1>` +
               `<div>${logContentHTML}</div>`;
    }

    private static getCurrrentDate(): string
    {
        const today = new Date();
        const day = today.getDate();
        const monthIndex = today.getMonth();
        const year = today.getFullYear();

        let daySuffix: string;
        switch (day % 10)
        {
            case 1:
                daySuffix = "st";
                break;
            case 2:
                daySuffix = "nd";
                break;
            case 3:
                daySuffix = "rd";
                break;
            default:
                daySuffix = "th";
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthIndex];

        return `${monthName} ${day}${daySuffix}, ${year}`;
    }
}
