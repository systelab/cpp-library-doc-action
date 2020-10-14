import { ReleaseBuild } from "./release-build.model";


export interface Configuration
{
    build: ReleaseBuild;
    changeLogReport: ChangeLogReportConfiguration;
    buildLogReport: BuildLogReportConfiguration;
    automatedTestExecutionLogReport: AutomatedTestExecutionLogReportConfiguration;
}

export interface ChangeLogReportConfiguration
{
    enabled: boolean;
    code?: string;
    version?: string;
    status?: string;
    baseTag?: string;
    filepath?: string;
}

export interface BuildLogReportConfiguration
{
    enabled: boolean;
}

export interface AutomatedTestExecutionLogReportConfiguration
{
    enabled: boolean;
}


