
export class DateUtility
{
    public static getCurrrentDateForHeader(): string
    {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const monthIndex = today.getMonth();
        const year = today.getFullYear();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[monthIndex];

        return `${day}-${monthName}-${year}`;
    }

    public static getCurrrentDateForContent(): string
    {
        const today = new Date();
        const day = today.getDate();
        const monthIndex = today.getMonth();
        const year = today.getFullYear();

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
