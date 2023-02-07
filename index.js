require("dotenv").config();
const inquirer = require("inquirer");
const {
    mainPrompt,
    addingEmployee,
    addingRole,
    addingDepartment,
} = require("./questions");
const cTable = require("console.table");
const db = require("./config/connections");

// Function to start application
const startTracker = () => {
    console.log("-----WELCOME TO THE EMPLOYEE TRACKER!-----");
    console.log(" ");
    askMainPrompt();
}

// Function to ask mainPrompt
const askMainPrompt = () => {
    inquirer.prompt(mainPrompt)
        .then((res) => {
            switch (res.mainChoice) {
                // When user selects Quit
                case "quit":
                    console.log("-----EMPLOYEE TRACKER APPLICATION ENDED. GOODBYE!-----");
                    break;

                // When user selects View All Employee
                case "view_employee":
                    console.log(" ");
                    db.query(`
                        SELECT employee.id AS ID, 
                        CONCAT(employee.first_name, " ", employee.last_name) AS Name, 
                        role.title AS Title,
                        department.name AS Department, 
                        role.salary AS Salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
                        FROM employee
                        LEFT JOIN role
                        ON employee.role_id = role.id
                        LEFT JOIN department
                        ON role.department_id = department.id
                        LEFT JOIN employee AS manager
                        ON manager.id = employee.manager_id;
                    `, (err, data) => {
                        if (err) throw err;
                        console.table(data);
                        askMainPrompt();
                    })
                    break;

                case "view_role":
                    console.log(" ");
                    db.query(`
                        SELECT role.id AS ID,
                        role.title AS Title,
                        role.salary AS Salary,
                        department.name AS Department
                        FROM role
                        LEFT JOIN department
                        ON role.department_id = department.id;
                    `, (err, data) => {
                        if (err) throw err;
                        console.table(data);
                        askMainPrompt();
                    })
                    break;

                // When user selects View All Departments
                case "view_department":
                    console.log(" ");
                    db.query(`
                        SELECT department.id AS ID,
                        department.name AS Departments
                        FROM department;
                    `, (err, data) => {
                        if (err) throw err;
                        console.table(data);
                        askMainPrompt();
                    })
                    break;
            }
        })
}

startTracker()