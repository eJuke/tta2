const axios = require("axios");
const qs = require("qs");
const { convertToBase64, logErrorAndExit } = require("./utils");
const { TT_URL, IS_DAY_OFF_URL, DayType } = require("./constants");

module.exports.loadTtPage = async (username, password, requestData) => {

    try {

        const response = await axios({
            method: "POST",
            url: TT_URL,
            headers: {
                "Authorization": `Basic: ${convertToBase64(`${username}:${password}`)}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: requestData
                ? qs.stringify(requestData, { encodeValuesOnly: true })
                : undefined
        });

        return response;
    }
    catch(error) {

        if (!error.response) {

            logErrorAndExit("Unknown network error. There is no response from server in proper time");
        }
        else if (error.response.status === 401) {

            logErrorAndExit("Please check your username and password. Server responded with HTTP 401 Unauthorized code");
        }
        else if (error.response.status === 500) {

            logErrorAndExit("Unknown server error, please try again later");
        }
        else {

            logErrorAndExit("Unknown error");
        }
    }
}

module.exports.getDayType = async (date, countryCode) => {

    const dateIsWeekend = date.weekday == 6 || date.weekday == 7;

    try {

        const response = await axios({
            method: "GET",
            url: `${IS_DAY_OFF_URL}/${date.toISODate()}?cc=${countryCode}`
        });

        if (response.data == "1" && dateIsWeekend) {

            return DayType.DayOff;
        }
        else if (response.data == "1" && !dateIsWeekend) {

            return DayType.Holiday;
        }
        else {

            return DayType.WorkDay;
        }
    }
    catch (errorResponse) {

        return dateIsWeekend
            ? DayType.DayOff
            : DayType.WorkDay;
    }
}
