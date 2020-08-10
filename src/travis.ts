import axios from "axios";


export class Travis
{
    public static async getJobLog(jobId: string): Promise<string>
    {
        console.log(`Querying Travis CI for log of job '${jobId}'...`);
        const response = await axios.get(`https://api.travis-ci.org/v3/job/${jobId}/log.txt`);
        if (response.status === 200)
        {
            console.log("Job log obtained successfully from Travis CI.");
            console.log("");
            return response.data;
        }
        else
        {
            throw Error("Error while querying Travis CI for job log: " + JSON.stringify(response));
        }
    }
}
