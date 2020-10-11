
export interface TestSuiteResult
{
    testCases: TestCaseResult[];
}

export enum TestCaseStatus
{
    Passed = "passed",
    Failed = "failed",
    Disabled = "disabled"
}

export interface TestCaseResult
{
    name: string;
    status: TestCaseStatus;
    time: number;
}
