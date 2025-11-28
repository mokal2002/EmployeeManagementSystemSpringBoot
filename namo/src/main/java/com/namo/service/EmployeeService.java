package com.namo.service;

import com.namo.entity.Employee;
import com.namo.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeService {

    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee createEmployee(Employee employee) {
    if (employee.getIsEnabled() == null) {
        employee.setIsEnabled(true);  // Set default if null
    }
    return employeeRepository.save(employee);
}


    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public void deleteEmployeeById(String id) {
        employeeRepository.deleteById(id);
    }

    public Employee updateEmployee(String id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setRole(employee.getRole());
        existingEmployee.setAbout(employee.getAbout());
        existingEmployee.setProfilePic(employee.getProfilePic());
        existingEmployee.setPhoneNumber(employee.getPhoneNumber());
        // Don't update password here unless explicitly changed

        return employeeRepository.save(existingEmployee);
    }

}
