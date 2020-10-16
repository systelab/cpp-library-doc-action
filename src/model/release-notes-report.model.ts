import { Repository } from "./repository.model";


export interface ReleaseNotesReport
{
    filepath?: string;
    documentVersion?: string;
    status?: string;
    code?: string;
    repository: Repository;
    version: string;
    markdownPath?: string;
}
