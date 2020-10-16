import { Repository, RepositoryType } from "@model";
import { ReleaseNotesReporter } from "@reporters";


describe("ChangelogReporter", () =>
{
    it("Generate a PDF with the release notes of 'JSONSettings CSW library' for 1.3.0 version", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.GitHub,
            owner: "systelab",
            slug: "cpp-json-settings",
            name: "JSONSettings CSW library",
            url: "https://github.com/systelab/cpp-json-settings.git"
        };
        const version = "1.3.0";
        await ReleaseNotesReporter.generateReport({repository, version});
    });

    it("Generate a PDF with the release notes of 'SignatureVerification CSW library' for 1.0.1 version", async () =>
    {
        const repository: Repository = {
            type: RepositoryType.Bitbucket,
            owner: "Systelab",
            slug: "cpp-signature-verification",
            name: "SignatureVerification CSW library",
            url: "https://bitbucket.org/Systelab/cpp-signature-verification.git"
        };
        const version = "1.0.1";
        const status = "Approved";
        await ReleaseNotesReporter.generateReport({repository, version, status: "Approved", documentVersion: "1.0"});
    });

});
