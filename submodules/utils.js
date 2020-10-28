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
