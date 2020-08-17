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
exports.LogReporter = void 0;
var core = require("@actions/core");
var appveyor_1 = require("./appveyor");
var travis_1 = require("./travis");
var pdf_report_1 = require("./pdf-report");
var LogReporter = /** @class */ (function () {
    function LogReporter() {
    }
    LogReporter.buildLogReportFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reportTitle, logContent, reportFilename, htmlReportContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportTitle = this.getReportTitle();
                        return [4 /*yield*/, this.getJobLog()];
                    case 1:
                        logContent = _a.sent();
                        reportFilename = this.getLogReportFilepath();
                        htmlReportContent = this.getHTMLReportContent(logContent);
                        return [4 /*yield*/, pdf_report_1.PDFReport.generate(reportTitle, htmlReportContent, reportFilename)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, reportFilename];
                }
            });
        });
    };
    LogReporter.getReportTitle = function () {
        var libraryName = core.getInput("library-name");
        var tagName = core.getInput("tag-name");
        return libraryName + " compilation memo for version " + tagName;
    };
    LogReporter.getJobLog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ciSystem, jobId;
            return __generator(this, function (_a) {
                ciSystem = core.getInput("ci-system");
                jobId = core.getInput("job-id");
                if (ciSystem === "AppVeyor") {
                    return [2 /*return*/, appveyor_1.AppVeyor.getJobLog(jobId)];
                }
                else if (ciSystem === "Travis") {
                    return [2 /*return*/, travis_1.Travis.getJobLog(jobId)];
                }
                else {
                    throw Error("Unsupported continuous integration system");
                }
                return [2 /*return*/];
            });
        });
    };
    LogReporter.getLogReportFilepath = function () {
        var libraryName = core.getInput("library-name");
        var tagName = core.getInput("tag-name");
        var configurationName = core.getInput("configuration-name");
        return libraryName + "-" + tagName + "-" + configurationName + "-BuildLog.log";
    };
    LogReporter.getHTMLReportContent = function (logContent) {
        var libraryName = core.getInput("library-name");
        var tagName = core.getInput("tag-name");
        var configurationName = core.getInput("configuration-name");
        var logContentHTML = "";
        var logContentLines = logContent.split(/\r\n|\n|\r/);
        for (var _i = 0, logContentLines_1 = logContentLines; _i < logContentLines_1.length; _i++) {
            var logLine = logContentLines_1[_i];
            logContentHTML += "<div class=\"log-line\">" + logLine + "</div>";
        }
        return "<h1>1 Introduction</h1>\n                <p class=\"last\">" + libraryName + " version " + tagName + " was built on August 8th, 2020 for the \"" + configurationName + "\" configuration.</p>\n                <h1>2 Log</h1>\n                <div>" + logContentHTML + "</div>";
    };
    return LogReporter;
}());
exports.LogReporter = LogReporter;
//# sourceMappingURL=log-reporter.js.map