

export class ActionInput
{
    public static getRepositoryOwner()
    {
        return process.env.INPUT_OWNER;
    }

    public static getRepositoryName()
    {
        return process.env.INPUT_REPO_NAME;
    }

    public static getLibraryName()
    {
        return process.env.INPUT_LIBRARY_NAME;
    }

    public static getTagName()
    {
        return process.env.INPUT_TAG_NAME;
    }

    public static getConfigurationName()
    {
        return process.env.INPUT_CONFIGURATION_NAME;
    }

    public static getCISystem()
    {
        return process.env.INPUT_CI_SYSTEM;
    }

    public static getJobId()
    {
        return process.env.INPUT_JOB_ID;
    }
}
