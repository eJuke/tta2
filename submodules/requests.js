const axios = require("axios");
const qs = require("qs");
const { convertToBase64, logErrorAndExit } = require("./utils");
const { TT_URL } = require("./constants");

module.exports.loadTtPage = (username, password, requestData) => {

    return axios({
        method: "POST",
        url: TT_URL,
        headers: {
            "Authorization": `Basic: ${convertToBase64(`${username}:${password}`)}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: requestData
            ? qs.stringify(requestData, { encodeValuesOnly: true })
            : undefined
    }).catch(error => {

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
    });
}
