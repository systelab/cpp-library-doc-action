import * as puppeteer from "puppeteer";

import { PDFDocument } from "@model";
import { FilesystemUtility } from "@utils";


export class PDFReporter
{
    public static async generate(document: PDFDocument): Promise<void>
    {
        console.log(`Generating PDF report on '${document.filepath}'...`);

        const headHTML = this.getReportHeadHTML();
        const pageHeaderHTML = this.getPageHeaderHTML(document);
        const pageFooterHTML = this.getPageFooterHTML();
        const contentHTML = `<html>
                                <head>${headHTML}</head>
                                <body>${document.content}</body>
                             </html>`;

        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
        const page = await browser.newPage();
        await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 2});
        await page.setContent(contentHTML);

        this.prepareOutputFolder(document.filepath);

        await page.pdf({ path: document.filepath,
                         displayHeaderFooter: true,
                         headerTemplate: pageHeaderHTML,
                         footerTemplate: pageFooterHTML,
                         format: "A4",
                         preferCSSPageSize: true,
                         margin: {
                            top: 150,
                            bottom: 95,
                            left: 35,
                            right: 35
                         }});

        await browser.close();

        console.log("PDF report generated successfully.");
        console.log("");
    }

    private static getReportHeadHTML(): string
    {
        return FilesystemUtility.readFile("src/reporters/templates/report-head.html");
    }

    private static getPageHeaderHTML(document: PDFDocument): string
    {
        let pageHeaderHTML = FilesystemUtility.readFile("src/reporters/templates/page-header.html");
        pageHeaderHTML = pageHeaderHTML.replace("$$TITLE$$", document.title);
        pageHeaderHTML = pageHeaderHTML.replace("$$DATE$$", document.date);

        return pageHeaderHTML;
    }

    private static getPageFooterHTML(): string
    {
        return FilesystemUtility.readFile("src/reporters/templates/page-footer.html");
    }

    private static prepareOutputFolder(pdfFilepath: string)
    {
        const pdfFolderpath = FilesystemUtility.getFolderPath(pdfFilepath);
        if (!FilesystemUtility.exists(pdfFolderpath))
        {
            FilesystemUtility.createFolder(pdfFolderpath);
        }
    }
}
