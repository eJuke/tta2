const { parseCliArguments, showHelp } = require("./submodules/argument-parser");
const { scanTimeTracker } = require("./submodules/scan-time-tracker");
const { fillTimeTracker } = require("./submodules/fill-time-tracker");

const parsedArguments = parseCliArguments();

if (!parsedArguments.actionName) {

    showHelp();
    process.exit();
}

if (parsedArguments.actionName === "scan-tt-options") {

    scanTimeTracker(parsedArguments);
}

if (parsedArguments.actionName === "fill") {

    fillTimeTracker(parsedArguments);
}
