"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PDFReport = void 0;
var fs = require("fs");
var puppeteer = require("puppeteer");
var PDFReport = /** @class */ (function () {
    function PDFReport() {
    }
    PDFReport.generate = function (title, content, pdfFilepath) {
        return __awaiter(this, void 0, void 0, function () {
            var headHTML, pageHeaderHTML, pageFooterHTML, contentHTML, browser, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headHTML = this.getReportHeadHTML();
                        pageHeaderHTML = this.getPageHeaderHTML(title);
                        pageFooterHTML = this.getPageFooterHTML();
                        contentHTML = "<html>\n                                <head>" + headHTML + "</head>\n                                <body>" + content + "</body>\n                             </html>";
                        return [4 /*yield*/, puppeteer.launch({ headless: true })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.setContent(contentHTML)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.pdf({ path: pdfFilepath,
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
                                } })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, browser.close()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PDFReport.getReportHeadHTML = function () {
        return fs.readFileSync("src/templates/report-head.html").toString();
    };
    PDFReport.getPageHeaderHTML = function (title) {
        var pageHeaderHTML = fs.readFileSync("src/templates/page-header.html").toString();
        pageHeaderHTML = pageHeaderHTML.replace("$$TITLE$$", title);
        pageHeaderHTML = pageHeaderHTML.replace("$$DATE$$", this.getCurrrentDate());
        return pageHeaderHTML;
    };
    PDFReport.getPageFooterHTML = function () {
        return fs.readFileSync("src/templates/page-footer.html").toString();
    };
    PDFReport.getCurrrentDate = function () {
        var today = new Date();
        var day = String(today.getDate()).padStart(2, "0");
        var monthIndex = today.getMonth();
        var year = today.getFullYear();
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthName = monthNames[monthIndex];
        return day + "-" + monthName + "-" + year;
    };
    return PDFReport;
}());
exports.PDFReport = PDFReport;
//# sourceMappingURL=pdf-report.js.map