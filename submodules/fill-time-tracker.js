const { DateTime } = require("luxon");
const { loadTtPage } = require("./requests");
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

module.exports.fillTimeTracker = async (params) => {

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

    const currentDate = DateTime.fromISO(params.startDate);

    const requestParams = {
        ctl00$_content$ddlProjects: selectedProject,
        ctl00$_content$ddlCategories: params.category,
        ctl00$_content$ucStartTime$ddlHour: params.startOfDay,
        ctl00$_content$ucStartTime$ddlMinutes: 0,
        ctl00$_content$ucEndTime$ddlHour: params.endOfDay,
        ctl00$_content$ucEndTime$ddlMinutes: 0,
        ctl00$_content$ddlUsers: userId,
        ctl00$_content$ddlMonths: currentDate.month,
        ctl00$_content$ddlYears: currentDate.year,
        ctl00$_content$ddlDays: currentDate.startOf("day").toFormat("dd.MM.yyyy 0:00:00"),
        ctl00$_content$tboxDescription: params.description,
    }

    const selectDayResponse = await selectDay(
        params.username,
        params.password,
        initialResponse.data,
        currentDate,
        requestParams,
    );

    const newTtRecordResponse = await addTtRecord(
        params.username,
        params.password,
        selectDayResponse.data,
        requestParams,
    );

    console.log(`${currentDate.toISODate()} - ${categories.find(i => i.value == params.category).name} - OK`);
}
