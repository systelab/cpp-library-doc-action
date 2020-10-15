
export enum RepositoryType
{
    GitHub = "GitHub",
    Bitbucket = "Bitbucket"
}

export interface Repository
{
    type: RepositoryType;
    owner: string;
    slug: string;
    name: string;
    url: string;
}
