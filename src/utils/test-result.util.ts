import * as DomParser from "dom-parser";

import { TestSuiteResult } from "@model";
import { FilesystemUtility } from "@utils";


export class TestResultUtility
{
    public static parseTestSuiteResult(xmlFilepath: string): TestSuiteResult
    {
        try
        {
            const fileContent = FilesystemUtility.readFile(xmlFilepath);
            const parser = new DomParser();
            const xmlDoc = parser.parseFromString(fileContent);

            const testSuites = xmlDoc.getElementsByTagName("testsuites")[0];

            return { testCases: [] };
        }
        catch (e)
        {
            return null;
        }
    }


}
