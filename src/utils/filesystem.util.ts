import * as fs from "fs";
import * as path from "path";


export class FilesystemUtility
{
    public static readFile(filePath: string, encoding = null): string
    {
        return fs.readFileSync(filePath, encoding).toString();
    }

    public static readFileLines(filepath: string): string[]
    {
        try
        {
            const data: string = this.readFile(filepath, "UTF-8");
            return data.split(/\r?\n/);
        }
        catch (Exception)
        {
            return [];
        }
    }

    public static createFolder(folderPath: string): void
    {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    public static deleteFolder(folderPath: string): void
    {
        if (this.exists(folderPath))
        {
            this.deleteFolderContents(folderPath);
            this.deleteEmptyFolder(folderPath, 3);
        }
    }

    public static deleteEmptyFolder(folderPath: string, maxRetries = 1)
    {
        for (let i = 1; i < maxRetries; i++)
        {
            try
            {
                fs.rmdirSync(folderPath);
                return;
            }
            catch (e)
            {
            }
        }

        fs.rmdirSync(folderPath);
    }

    public static deleteFolderContents(folderPath: string): void
    {
        if (this.exists(folderPath))
        {
            fs.readdirSync(folderPath).forEach((folderEntry, index) =>
            {
                const filepath = path.join(folderPath, folderEntry);
                if (fs.lstatSync(filepath).isDirectory())
                {
                    this.deleteFolderContents(filepath);
                    fs.rmdirSync(filepath);
                }
                else
                {
                    this.deleteFile(filepath);
                }
            });
        }
    }

    public static deleteFile(filepath: string): void
    {
        fs.unlinkSync(filepath);
    }

    public static exists(filesystemPath: string): boolean
    {
        return fs.existsSync(filesystemPath);
    }

    public static getAbsolutePath(relativePath: string): string
    {
        return path.resolve(relativePath);
    }
}
