import { Configuration, Repository } from "@model";
import { ChangelogReporter } from "@reporters";
import { ConfigurationUtility } from "@utils";


describe("Generate Release Documents", () =>
{
    const configuration: Configuration = ConfigurationUtility.load();

    if (configuration.changeLogReport.enabled)
    {
        it("Generate changelog report", async () =>
        {
            const repository: Repository = configuration.build.repository;
            const tag: string = configuration.build.tag;
            const status: string = configuration.changeLogReport.status;
            const code: string = configuration.changeLogReport.code;
            const filepath: string = configuration.changeLogReport.filepath;
            await ChangelogReporter.generateReport({repository, filepath, tag, status, code});
        });
    }

});
