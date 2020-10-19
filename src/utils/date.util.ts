
export class DateUtility
{
    public static getCurrrentDateForHeader(): string
    {
        const today = new Date();
        return this.getDateForHeader(today);
    }

    public static getDateForHeader(date: Date): string
    {
        const day = String(date.getDate()).padStart(2, "0");
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[monthIndex];

        return `${day}-${monthName}-${year}`;
    }

    public static getCurrrentDateForContent(): string
    {
        const today = new Date();
        return this.getDateForContent(today);
    }

    public static getDateForContent(date: Date): string
    {
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        let daySuffix: string;
        switch (day % 10)
        {
            case 1:
                daySuffix = "st";
                break;
            case 2:
                daySuffix = "nd";
                break;
            case 3:
                daySuffix = "rd";
                break;
            default:
                daySuffix = "th";
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthIndex];

        return `${monthName} ${day}${daySuffix}, ${year}`;
    }
}
