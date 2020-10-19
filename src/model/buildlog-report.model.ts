import { Repository } from "./repository.model";
import { ContinuousIntegrationSystem } from "./ci-system.model";


export interface BuildlogReport
{
    filepath?: string;
    version?: string;
    status?: string;
    code?: string;
    date?: Date;
    repository: Repository;
    tag: string;
    configuration: string;
    ciSystem: ContinuousIntegrationSystem;
    jobId: string;
}
