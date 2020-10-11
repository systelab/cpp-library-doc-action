import { AutomatedTestReport, PDFDocument, TestSuiteResult } from "@model";
import { DateUtility, TestResultUtility } from "@utils";

import { PDFReporter } from "./pdf.reporter";


export class AutomatedTestReporter
{
    public static async generateReport(report: AutomatedTestReport): Promise<PDFDocument>
    {
        const reportFilepath =  this.getReportFilepath(report);
        const reportTitle = this.getReportTitle(report);
        const reportDate = DateUtility.getCurrrentDateForHeader();

        const testSuiteResults: TestSuiteResult[] = await this.loadTestResultFiles(report);
        const htmlReportContent = this.getHTMLReportContent(report, testSuiteResults);

        const pdfDocument: PDFDocument = {
            filepath: reportFilepath,
            title: reportTitle,
            date: reportDate,
            content: htmlReportContent,
        };
        await PDFReporter.generate(pdfDocument);

        return pdfDocument;
    }

    private static getReportFilepath(report: AutomatedTestReport): string
    {
        return `report/${report.repository.name}-${report.tag}-${report.configuration}-AutomatedTestReport.pdf`;
    }

    private static getReportTitle(report: AutomatedTestReport): string
    {
        return `${report.repository.name} automated test report for version ${report.tag}`;
    }

    private static async loadTestResultFiles(report: AutomatedTestReport): Promise<TestSuiteResult[]>
    {
        const testSuiteResults: TestSuiteResult[] = [];
        for (const xmlFilepath of report.xmlFiles)
        {
            testSuiteResults.push(TestResultUtility.parseTestSuiteResult(xmlFilepath));
        }

        return testSuiteResults;
    }

    private static getHTMLReportContent(report: AutomatedTestReport, results: TestSuiteResult[]): string
    {
        return `<h1>1 Introduction</h1>` +
               `<p class="last">Automated tests for ${report.repository.name} version ${report.tag} were executed ` +
               `on ${DateUtility.getCurrrentDateForContent()} for the "${report.configuration}" configuration.</p>`;

        // TODO: add sections with details & results of all test suites
    }
}
