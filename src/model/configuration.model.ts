import { ReleaseBuild } from "./release-build.model";


export interface Configuration
{
    build: ReleaseBuild;
    changeLogReport: ChangeLogReportConfiguration;
    releaseNotesReport: ReleaseNotesConfiguration;
    buildLogReport: BuildLogReportConfiguration;
    automatedTestExecutionLogReport: AutomatedTestExecutionLogConfiguration;
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

export interface ReleaseNotesConfiguration
{
    enabled: boolean;
    code?: string;
    version?: string;
    status?: string;
    filepath?: string;
}

export interface AutomatedTestExecutionLogConfiguration
{
    enabled: boolean;
}
