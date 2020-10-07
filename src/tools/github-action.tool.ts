import { ContinuousIntegrationSystem } from "../model/ci-system.model";
import { ReleaseBuild } from "../model/release-build.model";
import { Repository, RepositoryType } from "../model/repository.model";


export class GitHubAction
{
    public static getCurrentReleaseBuild(): ReleaseBuild
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: process.env.INPUT_OWNER,
            slug: process.env.INPUT_REPO_NAME,
            name: process.env.INPUT_LIBRARY_NAME,
            url: `https://github.com/${process.env.INPUT_OWNER}/${process.env.INPUT_REPO_NAME}`
        };

        return {
            repository,
            tag: process.env.INPUT_TAG_NAME,
            configuration: process.env.INPUT_CONFIGURATION_NAME,
            ciSystem: process.env.INPUT_CI_SYSTEM as ContinuousIntegrationSystem,
            jobId: process.env.INPUT_JOB_ID
        };
    }
}
