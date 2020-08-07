import axios from "axios";


export class AppVeyor
{
    public static async getJobLog(jobId: string): Promise<string>
    {
        console.log("Querying for AppVeyor job log...");
        const response = await axios.get(`https://ci.appveyor.com/api/buildjobs/${jobId}/log`);
        if (response.status === 200)
        {
            console.log("AppVeyor job log obtained successfully");
            console.log("");
            return response.data;
        }
        else
        {
            throw Error("Error while querying AppVeyor job log: " + JSON.stringify(response));
        }
    }
}
