
export interface TestProjectResult
{
    tests: TestResult[];
}

export enum TestResultStatus
{
    Passed = "passed",
    Failed = "failed",
    Disabled = "disabled"
}

export interface TestResult
{
    name: string;
    status: TestResultStatus;
}
