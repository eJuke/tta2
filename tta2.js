const { parseCliArguments, showHelp } = require("./submodules/argument-parser");

const parsedArguments = parseCliArguments();

if (!parsedArguments.actionName) {

    showHelp();
    process.exit();
}