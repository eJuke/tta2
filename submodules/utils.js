module.exports.getStartOfMonth = () => {

    return new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
}

module.exports.getEndOfMonth = () => {

    return new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
}

/**
 * @param {Date} date js date
 */
module.exports.formatDate = (date) => {

    const padZero = (value, minLength) => {

        const stringValue = value.toString();
        return "0".repeat(Math.max(minLength - stringValue.length, 0)) + stringValue;
    }

    return date instanceof Date
        ? `${date.getFullYear()}-${padZero(date.getMonth() + 1, 2)}-${padZero(date.getDate(), 2)}`
        : null;
}

/**
 * @param {string} date string-formatted date
 */
module.exports.parseDate = (date) => {

    const nativelyParsedValue = Date.parse(date);

    if (isNaN(nativelyParsedValue)) {

        throw new Error(`Unable to parse provided date: ${date}`);
    }

    return new Date(nativelyParsedValue);
}

module.exports.convertToBase64 = (source) => {

    return Buffer.from(source).toString("base64")
}

module.exports.logErrorAndExit = (errorMessage) => {

    console.error(errorMessage);
    process.exit(1);
}

/**
 * 
 * @param {string} html 
 * @param {string} selectName 
 */
module.exports.getAllSelectOptions = (html, selectName) => {

    const selectStartPos = html.search((`<select.*name=.{1,5}${selectName}.*>`));
    const selectEndPos = selectStartPos + html.substring(selectStartPos).search("</select>") + 9;
    const selectCode = html.substring(selectStartPos, selectEndPos);

    const optionRegex = /<option.*value=\"(.*)\".*>(.*)<\/option>/ig;
    const options = [];
    let optionMatch;

    while(optionMatch = optionRegex.exec(selectCode)) {

        options.push({ value: optionMatch[1], name: optionMatch[2] });
    }

    return options.filter(i => i.value);
}