
export interface PDFDocument
{
    filepath: string;
    title: string;
    content: string;
    date: string;
    documentId?: number;
    version?: string;
    status?: string;
}
