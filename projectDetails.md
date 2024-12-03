### Your task is to create a backend system for Trustopay, a secure payment platform for freelancers and agencies. The system should include basic functionalities such as user authentication, contract creation, milestone-based payments, and project management.

Assignment 1: User Authentication

Requirements

1. *User Registration*
   - Create an API endpoint (POST /register) to register new users.
   - Accept the following fields: username, email, and password.
   - Ensure passwords are hashed before storing them in the database.
   - Validate the email format and ensure the username is unique.

2. *User Login*
   - Create an API endpoint (POST /login) to authenticate users.
   - Accept the email and password.
   - Generate a JWT token upon successful authentication.
   - Return the JWT token in the response.

 Assignment 2: Contract Creation

Requirements

1. *Create Contract*
   - Create an API endpoint (POST /contracts) to create a new contract.
   - Accept the following fields: contractName, clientName, freelancerName, startDate, endDate, and totalAmount.
   - Ensure the contract is associated with the authenticated user.
   - Validate the date formats and ensure the end date is after the start date.

2. *List Contracts*
   - Create an API endpoint (GET /contracts) to list all contracts for the authenticated user.
   - The response should include the contract details and status (e.g., active, completed).

Assignment 3: Milestone-Based Payments

Requirements

1. *Create Milestone*
   - Create an API endpoint (POST /contracts/:contractId/milestones) to create a new milestone for a contract.
   - Accept the following fields: milestoneName, description, dueDate, and amount.
   - Ensure the milestone is associated with an existing contract.
   - Validate the due date format and ensure it is within the contract's start and end dates.

2. *List Milestones*
   - Create an API endpoint (GET /contracts/:contractId/milestones) to list all milestones for a specific contract.
   - The response should include the milestone details and status (e.g., pending, completed).

### Assignment 4: Project Management

#### Requirements

1. *Create Project*
   - Create an API endpoint (POST /projects) to create a new project.
   - Accept the following fields: projectName, description, startDate, endDate, and contractId.
   - Ensure the project is associated with an existing contract.
   - Validate the date formats and ensure the end date is after the start date.

2. *List Projects*
   - Create an API endpoint (GET /projects) to list all projects for the authenticated user.
   - The response should include the project details and status (e.g., active, completed).

Additional Notes

- Use Node.js and Express for the backend.
- Use MongoDB as the database.
- Ensure proper error handling and validation for all API endpoints.
- Use environment variables to store sensitive information like database credentials and JWT secret.
- Document the API endpoints and provide sample requests and responses.a





TODO


[] fix validation of add contracts
[] validating token for expiry and validity