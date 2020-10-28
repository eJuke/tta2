const { ArgumentParser } = require("argparse");
const { DateTime } = require("luxon");

const parser = new ArgumentParser({
    description: "TimeTracker Autocomplete tool",
    add_help: false,
});

const actions = parser.add_subparsers({
    title: "Actions",
    dest: "actionName",
    description: "Type tta2 <action> --help for more details",
});

// FILL

const fillAction = actions.add_parser("fill", {
    description: "Fills the time tracker by provided values",
    help: "Fills the time tracker by provided values",
});

fillAction.add_argument("-u", "--username", {
    help: "Your username",
    required: true,
    type: "str",
});

fillAction.add_argument("-p", "--password", {
    help: "Your password",
    required: true,
    type: "str",
});

fillAction.add_argument("-d", "--description", {
    help: "Default description for all new records",
    required: true,
    type: "str",
});

fillAction.add_argument("-c", "--category", {
    help: "TimeTracker category",
    required: true,
    metavar: "ID",
    type: "int",
});

fillAction.add_argument("-pr", "--project", {
    help: "TimeTracker project. Default: default user project",
    metavar: "ID",
    type: "int",
});

fillAction.add_argument("-sd", "--start-date", {
    help: "First day of autocompletion. Default: first day of the month",
    type: "str",
    metavar: "YYYY-MM-DD",
    default: DateTime.local().startOf("month").toISODate(),
    dest: "startDate",
});

fillAction.add_argument("-ed", "--end-date", {
    help: "Last day of autocompletion. Default: last day of the month",
    type: "str",
    metavar: "YYYY-MM-DD",
    default: DateTime.local().endOf("month").toISODate(),
    dest: "endDate",
});

fillAction.add_argument("-sod", "--start-of-day", {
    help: "Start time for the working hours. Default: 10",
    type: "int",
    metavar: "HOUR",
    default: 10,
    dest: "startOfDay"
});

fillAction.add_argument("-eod", "--end-of-day", {
    help: "End time for the working hours. Default: 18",
    type: "int",
    metavar: "HOUR",
    default: 18,
    dest: "endOfDay"
});

// SCAN TT OPTIONS

const scanTtOptionsAction = actions.add_parser("scan-tt-options", {
    description: "Returns all available categories and projects",
    help: "Returns all available categories and projects",
});

scanTtOptionsAction.add_argument("-u", "--username", {
    help: "Your username",
    required: true,
    type: "str",
});

scanTtOptionsAction.add_argument("-p", "--password", {
    help: "Your password",
    required: true,
    type: "str",
});

module.exports.parseCliArguments = () => {

    return parser.parse_args();
}

module.exports.showHelp = () => {

    parser.print_help();
}
