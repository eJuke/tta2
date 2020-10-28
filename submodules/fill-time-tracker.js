const { DateTime } = require("luxon");
const { loadTtPage } = require("./requests");
const { logErrorAndExit, getAllSelectOptions, getInputValue } = require("./utils");

function selectDay(username, password, prevPageHtml, params) {

    const { category, project, date, startOfDay, endOfDay, description, userId } = params;

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
        ctl00$_content$ddlProjects: project,
        ctl00$_content$ddlCategories: category,
        ctl00$_content$ucStartTime$ddlHour: startOfDay,
        ctl00$_content$ucStartTime$ddlMinutes: 0,
        ctl00$_content$ucEndTime$ddlHour: endOfDay,
        ctl00$_content$ucEndTime$ddlMinutes: 0,
        ctl00$_content$ddlUsers: userId,
        ctl00$_content$ddlMonths: date.month,
        ctl00$_content$ddlYears: date.year,
        ctl00$_content$ddlDays: date.startOf("day").toFormat("dd.MM.yyyy 0:00:00"),
        ctl00$_content$tboxDescription: description,
    };

    return loadTtPage(username, password, requestData);
}

function addTtRecord(username, password, prevPageHtml, params) {

    const { category, project, date, startOfDay, endOfDay, description, userId } = params;

    const requestData = {
        __EVENTTARGET: "ctl00$_content$lbtnAddEntry",
        __VIEWSTATEGENERATOR: getInputValue(prevPageHtml, "__VIEWSTATEGENERATOR"),
        __VIEWSTATE: getInputValue(prevPageHtml, "__VIEWSTATE"),
        RadAJAXControlID: "ctl00__content_RadAjaxManager1",
        ctl00$_content$ScriptManager1: "ctl00$_content$ctl00$_content$panelEditFormPanel|ctl00$_content$lbtnAddEntry",
        ctl00$_content$ddlProjects: project,
        ctl00$_content$ddlCategories: category,
        ctl00$_content$ucStartTime$ddlHour: startOfDay,
        ctl00$_content$ucStartTime$ddlMinutes: 0,
        ctl00$_content$ucEndTime$ddlHour: endOfDay,
        ctl00$_content$ucEndTime$ddlMinutes: 0,
        ctl00$_content$ddlUsers: userId,
        ctl00$_content$ddlMonths: date.month,
        ctl00$_content$ddlYears: date.year,
        ctl00$_content$ddlDays: date.startOf("day").toFormat("dd.MM.yyyy 0:00:00"),
        ctl00$_content$tboxDescription: description,
    }

    return loadTtPage(username, password, requestData);
}

module.exports.fillTimeTracker = async (params) => {

    const initialResponse = await loadTtPage(params.username, params.password);

    const projects = getAllSelectOptions(initialResponse.data, "ctl00\\$_content\\$ddlProjects");
    const defaultProject = projects.find(i => i.selected).value;
    const selectedProject = params.project || defaultProject;

    const availableUsers = getAllSelectOptions(initialResponse.data, "ctl00\\$_content\\$ddlUsers");
    const userId = availableUsers.find(i => i.selected).value;

    if (!selectedProject) {

        logErrorAndExit("Unable to determine default project. Please specify that via --project option");
    }

    const requestParams = {
        category: params.category,
        project: selectedProject,
        date: DateTime.fromISO(params.startDate),
        startOfDay: params.startOfDay,
        endOfDay: params.endOfDay,
        description: params.description,
        userId,
    };

    const selectDayResponse = await selectDay(
        params.username,
        params.password,
        initialResponse.data,
        requestParams,
    );

    const newTtRecordResponse = await addTtRecord(
        params.username,
        params.password,
        selectDayResponse.data,
        requestParams,
    );

    console.log()
}
