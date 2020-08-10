import * as core from "@actions/core";
import * as fs from "fs";

import { AppVeyor } from "./appveyor";
import { Travis } from "./travis";


export class LogReporter
{
    public static async buildLogReportFile(): Promise<string>
    {
        const logContent: string = await this.getJobLog();
        const reportFilename =  this.getLogReportFilepath();
        fs.writeFileSync(reportFilename, logContent);

        return reportFilename;
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
}
