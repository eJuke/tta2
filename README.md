This project is based on [appulate/tta](https://github.com/appulate/tta) that is based on [ermolov/tta](https://github.com/erm0l0v/tta) etc...

## Supported commands:
- scan-tt-options - resolve available projects and categories
- fill - fill timetracker data for days provided

## scan-tt-options

CLI Argument name | Required | Description
----------------- | -------- | -----------
-u, --username | true | Your username
-p, --password | true | Your password

**Returns:** 2 lists - Available Projects and Available Categories. Data includes ID, name and default flag

## fill

CLI argument name     | Required | Default value          | Description
--------------------- | -------- | ---------------------- | -----------
-u, --username        | true     |                        | Your username
-p, --password        | true     |                        | Your password
-d, --description     | true     |                        | Default description for all new records
-c, --category        | true     |                        | TimeTracker category
-pr, --project        | false    | Default user project   | TimeTracker project.
-sd, --start-date     | false    | First day of the month | First day of autocompletion.
-ed, --end-date       | false    | Last day of the month  | Last day of autocompletion.
-sod, --start-of-day  | false    | 10                     | Start time for the working hours.
-eod, --end-of-day    | false    | 18                     | End time for the working hours.
-cc, --country-code   | false    | ru                     | Country code that's used to determine holidays and days off

**Returns:** autocomplete status for all days provided. Holidays (resolved by country code) are filled with Holiday category