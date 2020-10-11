import { Repository } from "./repository.model";


export interface ChangelogReport
{
    version?: string;
    status?: string;
    code?: string;
    repository: Repository;
    tag: string;
    baseTag?: string;
}
