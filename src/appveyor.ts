import axios from "axios";


export class AppVeyor
{
    public static async getJobLog(jobId: string): Promise<string>
    {
        console.log(`Querying AppVeyor for log of job '${jobId}'...`);
        const response = await axios.get(`https://ci.appveyor.com/api/buildjobs/${jobId}/log`);
        if (response.status === 200)
        {
            console.log("Job log obtained successfully from AppVeyor.");
            console.log("");
            return response.data;
        }
        else
        {
            throw Error("Error while querying AppVeyor for job log: " + JSON.stringify(response));
        }
    }

    public static async getJobArtifactContent(jobId: string, filename: string): Promise<string>
    {
        console.log(`Querying AppVeyor for artifact '${filename}' of job '${jobId}'...`);
        const response = await axios.get(`https://ci.appveyor.com/api/buildjobs/${jobId}/artifacts/${filename}`);
        if (response.status === 200)
        {
            console.log("Artifact obtained successfully from AppVeyor.");
            console.log("");
            return response.data;
        }
        else
        {
            throw Error("Error while querying AppVeyor for job artifact: " + JSON.stringify(response));
        }
    }
}
