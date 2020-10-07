import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";


export class PDFReporter
{
    public static async generate(title: string, content: string, pdfFilepath: string): Promise<void>
    {
        console.log(`Generating PDF report on '${pdfFilepath}'...`);

        const headHTML = this.getReportHeadHTML();
        const pageHeaderHTML = this.getPageHeaderHTML(title);
        const pageFooterHTML = this.getPageFooterHTML();
        const contentHTML = `<html>
                                <head>${headHTML}</head>
                                <body>${content}</body>
                             </html>`;

        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
        const page = await browser.newPage();
        await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 2});
        await page.setContent(contentHTML);

        this.prepareOutputFolder(pdfFilepath);

        await page.pdf({ path: pdfFilepath,
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
        return fs.readFileSync("src/reporters/templates/report-head.html").toString();
    }

    private static getPageHeaderHTML(title: string): string
    {
        let pageHeaderHTML = fs.readFileSync("src/reporters/templates/page-header.html").toString();
        pageHeaderHTML = pageHeaderHTML.replace("$$TITLE$$", title);
        pageHeaderHTML = pageHeaderHTML.replace("$$DATE$$", this.getCurrrentDate());

        return pageHeaderHTML;
    }

    private static getPageFooterHTML(): string
    {
        return fs.readFileSync("src/reporters/templates/page-footer.html").toString();
    }

    private static getCurrrentDate(): string
    {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const monthIndex = today.getMonth();
        const year = today.getFullYear();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[monthIndex];

        return `${day}-${monthName}-${year}`;
    }

    private static prepareOutputFolder(pdfFilepath: string)
    {
        const pdfFolderpath = path.dirname(pdfFilepath);
        if (!fs.existsSync(pdfFolderpath))
        {
            fs.mkdirSync(pdfFolderpath, { recursive: true });
        }
    }
}
