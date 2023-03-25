export function shortTxt(string, max) {

    const modified = string.substr(0, max);
    if (string.length > max) {
        return modified + "..."
    }
    return modified

}