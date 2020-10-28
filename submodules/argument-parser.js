const { ArgumentParser } = require("argparse");
const {
    getEndOfMonth,
    getStartOfMonth,
    formatDate,
} = require("./utils");

const parser = new ArgumentParser({
    description: "TimeTracker Autocomplete tool",
    add_help: false,
});

const actions = parser.add_subparsers({
    title: "Actions",
    dest: "actionName",
    description: "Type tta2 <action> --help for more details"
});

// FILL

const fillAction = actions.add_parser("fill", {
    description: "Fills the time tracker by provided values",
    help: "Fills the time tracker by provided values",
});

fillAction.add_argument("-u", "--username", {
    help: "Your username",
    type: "str"
});

fillAction.add_argument("-p", "--password", {
    help: "Your password",
    type: "str",
});

fillAction.add_argument("-d", "--description", {
    help: "Default description for all new records",
    type: "str",
});

fillAction.add_argument("-c", "--category", {
    help: "TimeTracker category",
    type: "int",
});

fillAction.add_argument("-pr", "--project", {
    help: "TimeTracker project. Default: first project of the list",
    type: "int",
});

fillAction.add_argument("-sd", "--start-date", {
    help: "First day of autocomplete. Default: first day of the month",
    type: "str",
    default: formatDate(getStartOfMonth()),
});

fillAction.add_argument("-ed", "--end-date", {
    help: "Last day of autocomplete. Default: last day of the month",
    type: "str",
    default: formatDate(getEndOfMonth()),
});

fillAction.add_argument("-sod", "--start-of-day", {
    help: "Hour of workday begin. Default: 10",
    type: "int",
    default: 10,
});

fillAction.add_argument("-eod", "--end-of-day", {
    help: "Hour of workday end. Default: 18",
    type: "int",
    default: 18,
});

// SCAN TT OPTIONS

const scanTtOptionsAction = actions.add_parser("scan-tt-options", {
    description: "Returns all available categories and projects",
    help: "Returns all available categories and projects",
});

scanTtOptionsAction.add_argument("-u", "--username", {
    help: "Your username",
});

scanTtOptionsAction.add_argument("-p", "--password", {
    help: "Your password",
});

module.exports.parseCliArguments = () => {

    return parser.parse_args();
}

module.exports.showHelp = () => {

    parser.print_help();
}