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

        reportContent = `<h1>1 Introduction</h1>` +
                        `<p class="last">This is an example of introduction section for PDF reports</p>` +
                        `<h1>2 Report</h1>` +
                        `<div>${logContentHTML}</div>`;
    });

    it("Generate a PDF report with the minimum fields on header", async () =>
    {
        const pdfDocument: PDFDocument = {
            filepath: "report/pdf-reporter-test-minimum.pdf",
            title: "Test of PDF with minimum fields on header",
            date: DateUtility.getCurrrentDateForHeader(),
            content: reportContent
        };
        await PDFReporter.generate(pdfDocument);
    });

    it("Generate a PDF report with document ID and status", async () =>
    {
        const pdfDocument: PDFDocument = {
            filepath: "report/pdf-reporter-test-header-fields.pdf",
            title: "Test of PDF with document ID and status",
            date: DateUtility.getCurrrentDateForHeader(),
            documentId: "SLT-NWT-MMRP-033",
            status: "Approved",
            content: reportContent
        };
        await PDFReporter.generate(pdfDocument);
    });

});
