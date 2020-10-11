import { Repository } from "./repository.model";


export interface AutomatedTestReport
{
    version?: string;
    status?: string;
    code?: string;
    repository: Repository;
    tag: string;
    configuration: string;
    xmlFiles: string[];
}
