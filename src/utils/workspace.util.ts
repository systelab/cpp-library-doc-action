import { FilesystemUtility } from "@utils";


export class WorkspaceUtility
{
    public static buildPath(relativePath: string)
    {
        const workspaceRootPath = process.env.RELEASE_DOCUMENTATION_CI_WORKSPACE || "";
        return FilesystemUtility.getJoinedPaths(workspaceRootPath, relativePath);
    }
}
