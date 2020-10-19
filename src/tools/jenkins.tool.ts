import axios from "axios";


export class Jenkins
{
    public static async getJobLog(jobId: string): Promise<string>
    {
        console.log(`Querying Jenkins for log of job '${jobId}'...`);
        const response = await axios.get(`${jobId}/consoleText`);
        if (response.status === 200)
        {
            console.log("Job log obtained successfully from Jenkins.");
            console.log("");
            return response.data;
        }
        else
        {
            throw Error("Error while querying Jenkins for job log: " + JSON.stringify(response));
        }
    }
}
