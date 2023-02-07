require("dotenv").config();
const inquirer = require("inquirer");
const {
    main,
    addEmployee,
    addRole,
    addDepartment,
} = require("./questions");
const cTable = require("console.table");
const db = require("./config/connection.js");

// Function to start application
const startTracker = () => {
    console.log("-----WELCOME TO THE EMPLOYEE TRACKER!-----");
    console.log(" ");
    askMainPrompt();
}

// Function to ask mainPrompt
const askMainPrompt = () => {
    console.log("hello")
    inquirer.prompt(main)
        .then((res) => {
            switch (res.mainChoice) {
                // When user selects Quit
                case "quit":
                    console.log("-----EMPLOYEE TRACKER APPLICATION ENDED. GOODBYE!-----");
                    break;

                // When user selects View All Employees
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

                // Wheen user selects View All Roles
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

                // When user selects Add Employee
                case "add_employee":
                    console.log(" ");
                    inquirer.prompt(addEmployee)
                        .then((res) => {
                            const newFirstName = res.first_name;
                            const newLastName = res.last_name;

                            // Adding employee - prompting to add role
                            db.query(`
                                SELECT role.title FROM role;
                            `, (err, data) => {
                                if (err) throw err;
                                const mapData = data.map((obj) => obj.title);
                                inquirer.prompt({
                                    type: "list",
                                    message: "What is the new employee's role?",
                                    name: "new_role",
                                    choices: mapData
                                })
                                    .then((res) => {
                                        const newRole = res.new_role;
                                        db.query(`
                                            SELECT role.id FROM role WHERE role.title = "${newRole}";
                                        `, (err, data) => {
                                            if (err) throw err;
                                            const newRoleID = data[0].id;

                                            // Adding employee - prompting to add manager
                                            db.query(`
                                                SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name
                                                FROM employee
                                                WHERE employee.manager_id IS NULL;
                                            `, (err, data) => {
                                                if (err) throw err;
                                                const mapData = data.map((obj) => { return obj.name });
                                                inquirer.prompt({
                                                    type: "list",
                                                    message: "Who is the new employee's manager?",
                                                    name: "new_manager",
                                                    choices: mapData
                                                })
                                                    .then((res) => {
                                                        const newManager = res.new_manager;
                                                        db.query(`
                                                            SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, ' ', employee.last_name) = "${newManager}";
                                                        `, (err, data) => {
                                                            if (err) throw err;
                                                            const newManagerID = data[0].id;

                                                            // Adding new employee into database
                                                            db.query(`
                                                                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                                VALUES ("${newFirstName}", "${newLastName}", ${newRoleID}, ${newManagerID});
                                                            `, (err, data) => {
                                                                if (err) throw err;
                                                                console.log("-----NEW EMPLOYEE ADDED TO DATABASE!-----");
                                                                console.log(" ");
                                                                askMainPrompt();
                                                            })
                                                        })

                                                    })
                                            })
                                        })

                                    })
                            })
                        })
                    break;

                // When user selects Add Role
                case "add_role":
                    console.log(" ");
                    inquirer.prompt(addRole)
                        .then((res) => {
                            const newRole = res.new_role;
                            const newRoleSalary = res.new_role_salary;

                            // Adding role - prompting to add department
                            db.query(`
                                SELECT department.name FROM department;
                            `, (err, data) => {
                                if (err) throw err;
                                const department = data.map((obj) => { return obj.name });
                                inquirer.prompt({
                                    type: "list",
                                    message: "What department does the new role belong to?",
                                    name: "new_role_department",
                                    choices: department
                                })
                                    .then((res) => {
                                        const newRoleDepartment = res.new_role_department;
                                        db.query(`
                                            SELECT department.id FROM department WHERE department.name = "${newRoleDepartment}";
                                        `, (err, data) => {
                                            if (err) throw err;
                                            const newRoleDepartmentID = data[0].id;

                                            // Adding new role into database
                                            db.query(`
                                                INSERT INTO role (title, salary, department_id)
                                                VALUES ("${newRole}", "${newRoleSalary}", ${newRoleDepartmentID});
                                            `, (err, data) => {
                                                if (err) throw err;
                                                console.log("-----NEW ROLE ADDED TO DATABASE!-----");
                                                console.log(" ");
                                                askMainPrompt();
                                            })
                                        })
                                    })
                            })
                        })
                    break;

                // When user selects Add Department
                case "add_department":
                    console.log(" ");
                    inquirer.prompt(addDepartment)
                        .then((res) => {
                            const newDepartment = res.new_department;

                            // Adding new department into database
                            db.query(`
                                INSERT INTO department (name)
                                VALUES ("${newDepartment}");
                            `, (err, data) => {
                                if (err) throw err;
                                console.log("-----NEW DEPARTMENT ADDED TO DATABASE!-----");
                                console.log(" ");
                                askMainPrompt();
                            })
                        })
                    break;

                // When user selects Update Employee Role
                case "update_role":
                    console.log(" ");
                    db.query(`
                        SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee;
                    `, (err, data) => {
                        if (err) throw err;
                        const employeeName = data.map((obj) => { return obj.name });
                        inquirer.prompt({
                            type: "list",
                            message: "Which employee do you want their role updated?",
                            name: "employee_update_name",
                            choices: employeeName
                        })
                            .then((res) => {
                                const employeeUpdateName = res.employee_update_name;

                                // Updating employee role - prompting for the new role
                                db.query(`
                                    SELECT role.title FROM role;
                                `, (err, data) => {
                                    if (err) throw err;
                                    const roleForUpdate = data.map((obj) => { return obj.title })
                                    inquirer.prompt({
                                        type: "list",
                                        message: "What will be the employee's new role?",
                                        name: "employee_update_role",
                                        choices: roleForUpdate
                                    })
                                        .then((res) => {
                                            const employeeUpdateRole = res.employee_update_role;

                                            db.query(`
                                                SELECT role.id FROM role WHERE role.title = "${employeeUpdateRole}";
                                            `, (err, data) => {
                                                if (err) throw err;
                                                const employeeUpdateRoleID = data[0].id;

                                                // Updating employee role in database
                                                db.query(`
                                                    UPDATE employee
                                                    SET role_id = ${employeeUpdateRoleID}
                                                    WHERE CONCAT(employee.first_name, ' ', employee.last_name) = "${employeeUpdateName}";
                                                `, (err, data) => {
                                                    if (err) throw err;
                                                    console.log("-----EMPLOYEE'S ROLE HAS BEEN UPDATED!-----");
                                                    console.log(" ");
                                                    askMainPrompt();
                                                })
                                            })
                                        })
                                })
                            })
                    })
                    break;


            }
        })
}

startTracker()