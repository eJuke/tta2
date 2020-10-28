const axios = require("axios");
const { convertToBase64, logErrorAndExit } = require("./utils");
const { TT_URL } = require("./constants");

module.exports.loadTtPage = (username, password) => {

    return axios.post(TT_URL, null, {
        headers: {
            "Authorization": `Basic: ${convertToBase64(`${username}:${password}`)}`
        }
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
