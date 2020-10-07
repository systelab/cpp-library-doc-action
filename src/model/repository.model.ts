
export enum RepositoryType
{
    GitHub,
    Bitbucket
}

export interface Repository
{
    type: RepositoryType;
    owner: string;
    slug: string;
    name: string;
    url: string;
}
