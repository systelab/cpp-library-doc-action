import * as fs from "fs";
import { PDFReporter } from "@reporters";



describe("PDFReporter", () =>
{
    it("Generate a PDF with content of 'test/resources/compilation.log' file", async () =>
    {
        let logContentHTML = "";
        const logContent = fs.readFileSync("test/resources/compilation.log").toString();
        const logContentLines = logContent.split(/\r\n|\n|\r/);
        for (const logLine of logContentLines)
        {
            logContentHTML += `<div class="log-line">${logLine}</div>`;
        }

        const reportContent = `<h1>1 Introduction</h1>
                            <p class="last">Trace API version 1.0.4 was built on August 8th, 2020 following steps described in build procedure.</p>
                            <h1>2 Report</h1>
                            <div>${logContentHTML}</div>`;

        await PDFReporter.generate("Trace API compilation memo for version 1.0.4", reportContent, "report/test-report.pdf");
    });
});
