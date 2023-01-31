USE employee_tracker_db;
INSERT INTO department (name)
VALUES ("Accounting"),
    ("Warehouse"),
    ("Sales"),
    ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Accounting Manager", 100000, 1),
    ("Accounting Associate", 60000, 1),
    ("Warehouse Manager", 100000, 2),
    ("Warehouse Associate", 80000, 2),
    ("Sales Manager", 100000, 3),
    ("Sales Associate", 80000, 3),
    ("Human Resources Manager", 100000, 4),
    ("Human Resources Associate", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Malone", 1, NULL),
    ("Angela", "Martin", 2, 1),
    ("Roy", "Anderson", 3, NULL),
    ("Darryl", "Philbin", 4, 3),
    ("Jim", "Halpert", 5, NULL),
    ("Dwight", "Schrute", 6, 5),
    ("Toby", "Flenderson", 7, NULL),
    ("Kelly", "Kapoor", 8, 7);