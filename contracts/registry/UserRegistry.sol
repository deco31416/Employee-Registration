// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../access/AccessControlRoles.sol";
import "../payroll/PayrollEvents.sol";

/**
 * @title UserRegistry
 * @dev Registro y control de empleados con protección de datos sensibles por roles.
 */
contract UserRegistry is AccessControlRoles {
    struct Employee {
        string fullName;
        string email;
        string country;
        string position;
        string skillPrincipal;
        string skillSecundaria;
        string skillTerciaria;
        string[] otrasSkills;
        uint256 monthlySalaryUSD;
        string preferredToken;
        address paymentWallet;
        bool active;
    }

    struct EmployeeView {
        address wallet;
        string fullName;
        string email;
        string country;
        string position;
        string skillPrincipal;
        string skillSecundaria;
        string skillTerciaria;
        uint256 monthlySalaryUSD;
        string preferredToken;
        address paymentWallet;
        bool active;
    }

    mapping(address => Employee) private employees;
    address[] private employeeAddresses;

    constructor(address initialAdmin) AccessControlRoles(initialAdmin) {}

    modifier onlyAdminOrAuthorized() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) ||
            hasRole(COMPLIANCE_ROLE, msg.sender) ||
            hasRole(PAYROLL_ROLE, msg.sender) ||
            hasRole(OPERATOR_ROLE, msg.sender) ||
            hasRole(FINANCE_ROLE, msg.sender) ||
            hasRole(AUDITOR_ROLE, msg.sender),
            "Access denied: must have an authorized role"
        );
        _;
    }

    function registerEmployee(
        address wallet,
        string memory fullName,
        string memory email,
        string memory country,
        string memory position,
        string memory skillPrincipal,
        string memory skillSecundaria,
        string memory skillTerciaria,
        string[] memory otrasSkills,
        uint256 monthlySalaryUSD,
        string memory preferredToken,
        address paymentWallet
    ) external onlyAdminOrAuthorized {
        require(wallet != address(0), "Invalid wallet");
        require(!employees[wallet].active, "Employee already active");

        employees[wallet] = Employee(
            fullName,
            email,
            country,
            position,
            skillPrincipal,
            skillSecundaria,
            skillTerciaria,
            otrasSkills,
            monthlySalaryUSD,
            preferredToken,
            paymentWallet,
            true
        );

        employeeAddresses.push(wallet);

        emit PayrollEvents.EmployeeRegistered(wallet, fullName, country, position);
        emit PayrollEvents.EmployeeSkillsUpdated(wallet, skillPrincipal, skillSecundaria, skillTerciaria, otrasSkills);
        emit PayrollEvents.EmployeeUpdated(wallet, fullName, email, country, position, preferredToken);
        emit PayrollEvents.EmployeeSalaryUpdated(wallet, 0, monthlySalaryUSD);
        emit PayrollEvents.EmployeeWalletUpdated(wallet, address(0), paymentWallet);
    }

    function updateEmployeeGeneralData(
        address wallet,
        string memory fullName,
        string memory email,
        string memory country,
        string memory position,
        string memory preferredToken
    ) external onlyAdminOrAuthorized {
        require(employees[wallet].active, "Employee not active");
        employees[wallet].fullName = fullName;
        employees[wallet].email = email;
        employees[wallet].country = country;
        employees[wallet].position = position;
        employees[wallet].preferredToken = preferredToken;

        emit PayrollEvents.EmployeeUpdated(wallet, fullName, email, country, position, preferredToken);
    }

    function updateEmployeeSkills(
        address wallet,
        string memory skillPrincipal,
        string memory skillSecundaria,
        string memory skillTerciaria,
        string[] memory otrasSkills
    ) external onlyAdminOrAuthorized {
        require(employees[wallet].active, "Employee not active");

        employees[wallet].skillPrincipal = skillPrincipal;
        employees[wallet].skillSecundaria = skillSecundaria;
        employees[wallet].skillTerciaria = skillTerciaria;
        employees[wallet].otrasSkills = otrasSkills;

        emit PayrollEvents.EmployeeSkillsUpdated(wallet, skillPrincipal, skillSecundaria, skillTerciaria, otrasSkills);
    }

    function updateEmployeeSalary(address wallet, uint256 newSalary)
        external
        onlyAdminOrAuthorized
    {
        require(employees[wallet].active, "Employee not active");
        uint256 oldSalary = employees[wallet].monthlySalaryUSD;
        employees[wallet].monthlySalaryUSD = newSalary;

        emit PayrollEvents.EmployeeSalaryUpdated(wallet, oldSalary, newSalary);
    }

    function updateEmployeeWallet(address wallet, address newWallet)
        external
        onlyAdminOrAuthorized
    {
        require(employees[wallet].active, "Employee not active");
        address oldWallet = employees[wallet].paymentWallet;
        employees[wallet].paymentWallet = newWallet;

        emit PayrollEvents.EmployeeWalletUpdated(wallet, oldWallet, newWallet);
    }

    function deactivateEmployee(address wallet) external onlyAdminOrAuthorized {
        require(employees[wallet].active, "Employee already inactive");
        employees[wallet].active = false;
        emit PayrollEvents.EmployeeStatusUpdated(wallet, false);
    }

    function activateEmployee(address wallet) external onlyAdminOrAuthorized {
        require(!employees[wallet].active, "Employee already active");
        employees[wallet].active = true;
        emit PayrollEvents.EmployeeStatusUpdated(wallet, true);
    }

    function getEmployeeMetadata(address wallet)
        external
        view
        onlyAdminOrAuthorized
        returns (
            string memory country,
            string memory position,
            string memory skillPrincipal,
            string memory skillSecundaria,
            string memory skillTerciaria,
            string[] memory otrasSkills,
            bool active
        )
    {
        Employee memory e = employees[wallet];
        return (
            e.country,
            e.position,
            e.skillPrincipal,
            e.skillSecundaria,
            e.skillTerciaria,
            e.otrasSkills,
            e.active
        );
    }

    function getSensitiveEmployeeData(address wallet)
        external
        view
        onlyAdminOrAuthorized
        returns (
            string memory fullName,
            string memory email,
            uint256 monthlySalaryUSD,
            address paymentWallet
        )
    {
        Employee memory e = employees[wallet];
        return (e.fullName, e.email, e.monthlySalaryUSD, e.paymentWallet);
    }

    /**
     * @dev Devuelve todos los empleados en una sola llamada optimizada
     */
    function getAllEmployeesWithSensitiveData()
        external
        view
        onlyAdminOrAuthorized
        returns (EmployeeView[] memory)
    {
        uint len = employeeAddresses.length;
        EmployeeView[] memory allEmployees = new EmployeeView[](len);

        for (uint i = 0; i < len; i++) {
            address wallet = employeeAddresses[i];
            Employee memory e = employees[wallet];
            allEmployees[i] = EmployeeView({
                wallet: wallet,
                fullName: e.fullName,
                email: e.email,
                country: e.country,
                position: e.position,
                skillPrincipal: e.skillPrincipal,
                skillSecundaria: e.skillSecundaria,
                skillTerciaria: e.skillTerciaria,
                monthlySalaryUSD: e.monthlySalaryUSD,
                preferredToken: e.preferredToken,
                paymentWallet: e.paymentWallet,
                active: e.active
            });
        }

        return allEmployees;
    }

    function isActive(address wallet) external view returns (bool) {
        return employees[wallet].active;
    }
}
