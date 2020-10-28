module.exports.convertToBase64 = (source) => {

    return Buffer.from(source).toString("base64")
}

module.exports.logErrorAndExit = (errorMessage) => {

    console.error(errorMessage);
    process.exit(1);
}

module.exports.getAllSelectOptions = (html, selectName) => {

    const selectStartPos = html.search(new RegExp(`<select.*name="${selectName}".*>`));
    const selectEndPos = selectStartPos + html.substring(selectStartPos).search("</select>") + 9;
    const selectCode = html.substring(selectStartPos, selectEndPos);

    const optionRegex = /<option\s*(selected)?.*value=\"(.*)\".*>(.*)<\/option>/ig;
    const options = [];
    let optionMatch;

    while(optionMatch = optionRegex.exec(selectCode)) {

        options.push({ value: optionMatch[2], name: optionMatch[3], selected: !!optionMatch[1] });
    }

    return options.filter(i => i.value);
}

module.exports.getInputValue = (html, inputName) => {

    const inputRegex = new RegExp(`<input.*name="${inputName}".*value="(.*)".*>`);
    const searchResult = inputRegex.exec(html);

    return searchResult
        ? searchResult[1]
        : null;
}
