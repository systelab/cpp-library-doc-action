import { PDFDocument } from "@model";
import { PDFReporter } from "@reporters";
import { DateUtility, FilesystemUtility } from "@utils";


describe("PDFReporter", () =>
{
    let reportContent: string;

    before(async () =>
    {
        let logContentHTML = "";
        const logContentLines = FilesystemUtility.readFileLines("test/resources/compilation.log");
        for (const logLine of logContentLines)
        {
            logContentHTML += `<div class="log-line">${logLine}</div>`;
        }

        reportContent = `<h1>Introduction</h1>` +
                        `<p>This is an example of introduction section for PDF reports</p>` +
                        `<h1>Report</h1>` +
                        `<div>${logContentHTML}</div>`;
    });

    it("Generate a PDF report without fields on header", async () =>
    {
        const pdfDocument: PDFDocument = {
            filepath: "report/pdf-reporter-no-fields.pdf",
            title: "Test of PDF WITHOUT FIELDS on header",
            content: reportContent
        };
        await PDFReporter.generate(pdfDocument);
    });

    it("Generate a PDF report with date and document code fields on header", async () =>
    {
        const pdfDocument: PDFDocument = {
            filepath: "report/pdf-reporter-some-fields.pdf",
            title: "Test of PDF with SOME FIELDS on header",
            date: DateUtility.getCurrrentDateForHeader(),
            code: "SLT-NWT-MMRP-033",
            content: reportContent
        };
        await PDFReporter.generate(pdfDocument);
    });

    it("Generate a PDF report with all fields on header", async () =>
    {
        const pdfDocument: PDFDocument = {
            filepath: "report/pdf-reporter-all-fields.pdf",
            title: "Test of PDF with ALL FIELDS on header",
            version: "2.1",
            status: "Draft",
            date: DateUtility.getCurrrentDateForHeader(),
            code: "SLT-NWT-MMRP-033",
            content: reportContent
        };
        await PDFReporter.generate(pdfDocument);
    });

});
