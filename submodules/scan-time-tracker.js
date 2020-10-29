const { loadTtPage } = require("./requests");
const { getAllSelectOptions } = require("./utils");

module.exports.scanTimeTracker = async (params) => {

    const response = await loadTtPage(params.username, params.password)

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
}
