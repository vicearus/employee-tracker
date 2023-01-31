require("dotenv").config();
const inquirer = require("inquirer");
const { 
    mainPrompt,
    addingEmployee,
    addingRole,
    addingDepartment,
} = require("./questions");
const table = require("console.table");
const db = require("./config/connections");