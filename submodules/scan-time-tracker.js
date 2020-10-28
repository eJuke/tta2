const axios = require("axios");
const { convertToBase64, logErrorAndExit, getAllSelectOptions } = require("./utils");
const { TT_URL } = require("./constants");

module.exports.scanTimeTracker = async (params) => {

    axios.post(TT_URL, null, {
        headers: {
            "Authorization": `Basic: ${convertToBase64(`${params.username}:${params.password}`)}`
        }
    }).then(response => {

        const html = response.data;

        console.log("AVAILABLE PROJECTS:");
        getAllSelectOptions(html, "ctl00\\$_content\\$ddlProjects")
            .forEach(option => {

                console.log(`${option.name} (${option.value}${option.selected ? " - DEFAULT" : ""})`);
            });

        console.log();
        console.log("AVAILABLE CATEGORIES:");
        getAllSelectOptions(html, "ctl00\\$_content\\$ddlCategories")
            .forEach(option => {

                console.log(`${option.name} (${option.value})`);
            });
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
    })
}
