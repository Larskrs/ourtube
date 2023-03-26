import moment from "moment/moment";

export function shortTxt(string, max) {

    const modified = string.substr(0, max);
    if (string.length > max) {
        return modified + "..."
    }
    return modified

}

export function getTimeAgo (date) {

    const dif = new Date() - new Date(date);
    console.log(dif)
    
    let formatted
    
    const week = (1000*60*60*24)
    if ((dif / week) > 7) {
        return moment(date).format('DD.MM.YYYY')
    }
    formatted = moment(date).startOf('seconds').fromNow()
    const output = formatted
    return (output)
}