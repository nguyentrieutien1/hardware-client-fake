export const formattedDate  = (date) => {
    const newDate =  new Date(date); // Current date
    return newDate?.toLocaleDateString('en-GB');
}