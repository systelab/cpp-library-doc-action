import { FilesystemUtility } from "./filesystem.util";
import { WorkspaceUtility } from "./workspace.util";
import { Configuration } from "@model";


export class ConfigurationUtility
{
    public static load(): Configuration
    {
        if (!process.env.RELEASE_DOCUMENTATION_CI_CONFIG_FILE)
        {
            throw Error("Configuration file not defined.\n" +
                        "Set 'RELEASE_DOCUMENTATION_CI_CONFIG_FILE' environment variable before executing this script.");
        }

        const configurationFile = process.env.RELEASE_DOCUMENTATION_CI_CONFIG_FILE;
        const configurationFilepath = WorkspaceUtility.buildPath(configurationFile);

        return this.loadFromFilepath(configurationFilepath);
    }

    public static loadFromFilepath(filepath: string): Configuration
    {
        console.log(`Configuration file: ${filepath}`);
        const fileContent = FilesystemUtility.readFile(filepath);

        const configuration: Configuration = JSON.parse(fileContent);
        console.log(`Loaded configuration: ${JSON.stringify(configuration)}`);
        console.log();

        return configuration;
    }
}
