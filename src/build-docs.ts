import { Configuration, Repository } from "@model";
import { ChangelogReporter } from "@reporters";
import { ConfigurationUtility, WorkspaceUtility } from "@utils";


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
            const version: string = configuration.changeLogReport.version;
            const code: string = configuration.changeLogReport.code;
            const filepath: string = WorkspaceUtility.buildPath(configuration.changeLogReport.filepath);
            await ChangelogReporter.generateReport({repository, tag, status, version, code, filepath});
        });
    }

});
