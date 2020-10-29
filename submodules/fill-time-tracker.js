const { DateTime } = require("luxon");
const { DayType } = require("./constants");
const { loadTtPage, getDayType } = require("./requests");
const { logErrorAndExit, getAllSelectOptions, getInputValue } = require("./utils");

function selectDay(username, password, prevPageHtml, date, sharedRequestParams) {

    const daysSinceStartOfCentury = date
        .startOf("day")
        .diff(DateTime.fromISO("2000-01-01"), "day")
        .days;

    const requestData = {
        __EVENTTARGET: "ctl00$_content$calDatesSelector",
        __EVENTARGUMENT: daysSinceStartOfCentury,
        __VIEWSTATEGENERATOR: getInputValue(prevPageHtml, "__VIEWSTATEGENERATOR"),
        __VIEWSTATE: getInputValue(prevPageHtml, "__VIEWSTATE"),
        RadAJAXControlID: "ctl00__content_RadAjaxManager1",
        ctl00$_content$ScriptManager1: "ctl00$_content$ctl00$_content$panelEditFormPanel|ctl00$_content$lbtnAddEntry",
        ...sharedRequestParams,
    };

    return loadTtPage(username, password, requestData);
}

function addTtRecord(username, password, prevPageHtml, sharedRequestParams) {

    const requestData = {
        __EVENTTARGET: "ctl00$_content$lbtnAddEntry",
        __VIEWSTATEGENERATOR: getInputValue(prevPageHtml, "__VIEWSTATEGENERATOR"),
        __VIEWSTATE: getInputValue(prevPageHtml, "__VIEWSTATE"),
        RadAJAXControlID: "ctl00__content_RadAjaxManager1",
        ctl00$_content$ScriptManager1: "ctl00$_content$ctl00$_content$panelEditFormPanel|ctl00$_content$lbtnAddEntry",
        ...sharedRequestParams,
    }

    return loadTtPage(username, password, requestData);
}

async function fillSingleDay(
    params,
    initialResponse,
) {

    const requestParams = {
        ctl00$_content$ddlProjects: params.selectedProject,
        ctl00$_content$ddlCategories: params.category,
        ctl00$_content$ucStartTime$ddlHour: params.startOfDay,
        ctl00$_content$ucStartTime$ddlMinutes: 0,
        ctl00$_content$ucEndTime$ddlHour: params.endOfDay,
        ctl00$_content$ucEndTime$ddlMinutes: 0,
        ctl00$_content$ddlUsers: params.userId,
        ctl00$_content$ddlMonths: params.currentDate.month,
        ctl00$_content$ddlYears: params.currentDate.year,
        ctl00$_content$ddlDays: params.currentDate.startOf("day").toFormat("dd.MM.yyyy 0:00:00"),
        ctl00$_content$tboxDescription: params.description,
    }

    const selectDayResponse = await selectDay(
        params.username,
        params.password,
        initialResponse.data,
        params.currentDate,
        requestParams,
    );

    return addTtRecord(
        params.username,
        params.password,
        selectDayResponse.data,
        requestParams,
    );
}

module.exports.fillTimeTracker = async (params) => {

    if (DateTime.fromISO(params.endDate).diff(DateTime.fromISO(params.startDate), "days").days < 0) {

        logErrorAndExit("Please check your range. Start date is after end date");
    }

    const initialResponse = await loadTtPage(params.username, params.password);

    const categories = getAllSelectOptions(initialResponse.data, "ctl00\\$_content\\$ddlCategories");
    const projects = getAllSelectOptions(initialResponse.data, "ctl00\\$_content\\$ddlProjects");
    const defaultProject = projects.find(i => i.selected).value;
    const selectedProject = params.project || defaultProject;

    const availableUsers = getAllSelectOptions(initialResponse.data, "ctl00\\$_content\\$ddlUsers");
    const userId = availableUsers.find(i => i.selected).value;

    if (!selectedProject) {

        logErrorAndExit("Unable to determine default project. Please specify that via --project option");
    }

    let currentDate = DateTime.fromISO(params.startDate);
    const endDate = DateTime.fromISO(params.endDate);

    do {

        const dayType = await getDayType(currentDate);

        const description = dayType == DayType.Holiday
            ? "Holiday"
            : params.description;

        const category = dayType == DayType.Holiday
            ? categories.find(i => i.name.trim() === "Holiday").value
            : params.category;

        if (dayType == DayType.DayOff) {

            console.log(`${currentDate.toISODate()} - ${categories.find(i => i.value == category).name} - SKIPPED (Day off)`);
        }
        else {

            try {

                await fillSingleDay(
                    {
                        ...params,
                        userId,
                        selectedProject,
                        currentDate,
                        description,
                        category,
                    },
                    initialResponse,
                );

                console.log(`${currentDate.toISODate()} - ${categories.find(i => i.value == category).name} - OK`);
            }
            catch {

                console.log(`${currentDate.toISODate()} - ${categories.find(i => i.value == category).name} - FAILED`);
            }
        }

        currentDate = currentDate.plus({ day: 1 });
    } while (endDate.diff(currentDate, "days").days >= 0)
}
