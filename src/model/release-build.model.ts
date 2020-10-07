import { ContinuousIntegrationSystem } from "./ci-system.model";
import { Repository } from "./repository.model";


export interface ReleaseBuild
{
    repository: Repository;
    tag: string;
    configuration: string;
    ciSystem: ContinuousIntegrationSystem;
    jobId: string;
}
