export function trimNewline(input: string | null) {
    if (input) {
      const trimmed = input.replace(/\\n|\\l/g, "").trim();
      return trimmed;
    }
    else{
      return "";
    }   
}

export function getFormattedDate(date: string) {
    const d = new Date(date);

    return (
        d.getFullYear() +
        "-" + String(d.getMonth() + 1).padStart(2, "0") +
        "-" + String(d.getDate()).padStart(2, "0") +
        " " + String(d.getHours()).padStart(2, "0") +
        ":" + String(d.getMinutes()).padStart(2, "0") +
        ":" + String(d.getSeconds()).padStart(2, "0")
    );
}