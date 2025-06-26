# Digital Wallet Application

A full-stack digital wallet application built with .NET Core for the backend API and Angular for the frontend client.

## Overview

This Digital Wallet application provides users with a secure platform to manage their finances, perform transactions, and handle payment methods. The solution is structured into two main components:

1. **Backend API** (.NET Core)
2. **Frontend Client** (Angular)

## Project Structure

```
Digital Wallet/
├── backend/
│   └── DigitalWalletAPI/ - .NET Core API
│       ├── Controllers/ - API endpoints
│       ├── Data/ - Database context
│       ├── DTOs/ - Data Transfer Objects
│       ├── Mappings/ - AutoMapper profiles
│       ├── Models/ - Entity models
│       └── Services/ - Business logic
│
└── frontend/
    └── digital-wallet-client/ - Angular application
        ├── src/
        │   ├── app/
        │   │   ├── components/ - UI components
        │   │   ├── guards/ - Route guards
        │   │   ├── interceptors/ - HTTP interceptors
        │   │   ├── models/ - Type definitions
        │   │   └── services/ - API services
        │   └── styles.scss - Global styles
        └── angular.json - Angular configuration
```

## Backend Features

The backend API provides the following functionality:

- **Authentication & Authorization** - User registration, login, and JWT-based authentication
- **User Management** - User profile creation and management
- **Payment Methods** - Adding, updating, and managing payment methods
- **Transaction Processing** - Secure transaction handling between users
- **Data Validation** - Input validation and error handling

### Key Technologies - Backend

- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Database
- **AutoMapper** - Object-to-object mapping
- **BCrypt** - Password hashing
- **JWT Authentication** - Token-based security

## Frontend Features

The Angular client offers a responsive, user-friendly interface with:

- **User Dashboard** - Overview of account balance and recent transactions
- **Transaction Management** - Send/receive money and view transaction history
- **Payment Methods** - Add, edit, and remove payment methods
- **Profile Settings** - Update personal information and security settings
- **Responsive Design** - Works on desktop and mobile devices

### Key Technologies - Frontend

- **Angular** - Frontend framework
- **RxJS** - Reactive programming library
- **Angular Material** - UI component library
- **SCSS** - Styling
- **JWT Handling** - Token storage and refresh

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (version 9.0)
- [Node.js](https://nodejs.org/) (version 18.x or later)
- [Angular CLI](https://angular.io/cli) (version 16.x or later)
- [SQL Server](https://www.microsoft.com/sql-server/) (Local or Express edition)

### Backend Setup

1. Navigate to the backend project directory:
   ```bash
   cd backend/DigitalWalletAPI
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json` to point to your SQL Server instance:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=DigitalWallet;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

4. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

5. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` and `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend project directory:
   ```bash
   cd frontend/digital-wallet-client
   ```

2. Install NPM packages:
   ```bash
   npm install
   ```

3. Configure the API URL in the environment files at `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

The frontend will be available at `http://localhost:4200`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Payment Methods
- `GET /api/paymentmethod` - Get all payment methods for current user
- `GET /api/paymentmethod/{id}` - Get payment method by ID
- `POST /api/paymentmethod` - Add a new payment method
- `PUT /api/paymentmethod/{id}` - Update payment method
- `DELETE /api/paymentmethod/{id}` - Delete payment method

### Transactions
- `GET /api/transaction` - Get all transactions for current user
- `GET /api/transaction/{id}` - Get transaction by ID
- `POST /api/transaction` - Create a new transaction
- `GET /api/transaction/sent` - Get sent transactions
- `GET /api/transaction/received` - Get received transactions

## Security Features

- **Password Hashing** - BCrypt for secure password storage
- **JWT Authentication** - Token-based API security
- **HTTPS** - Encrypted data transmission
- **Input Validation** - Protection against injection attacks
- **CORS Policy** - Controlled resource sharing

## Future Enhancements

- **Push Notifications** - Real-time transaction alerts
- **Two-Factor Authentication** - Additional security layer
- **QR Code Payments** - Faster transaction processing
- **Currency Conversion** - Support for multiple currencies
- **Spending Analytics** - Visual reports and insights

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: support@digitalwallet.com
- GitHub: [StephenStepDude/Digitalwallet](https://github.com/StephenStepDude/Digitalwallet.git)
