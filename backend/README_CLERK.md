# Clerk Authentication Integration

This document provides instructions on how to set up and use Clerk authentication with the Django backend.

## Overview

Clerk is a user management and authentication service that provides a simple way to add authentication to your application. This integration allows you to use Clerk for authentication in your frontend while still using Django for your backend.

## Setup

### 1. Install Required Packages

Make sure you have the following packages installed:

```bash
pip install django-environ PyJWT cryptography requests
```

### 2. Configure Environment Variables

Add the following environment variables to your `.env` file:

```
# Clerk Authentication Settings
CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_JWT_ISSUER=https://your-clerk-issuer
CLERK_JWT_AUDIENCE=your-api-audience
```

Replace the values with your actual Clerk configuration.

### 3. Apply Migrations

Run the following command to apply the migrations:

```bash
python manage.py migrate
```

## How It Works

### Authentication Flow

1. The frontend uses Clerk to authenticate users and obtain a JWT token.
2. The frontend includes this token in the `Authorization` header of requests to the backend.
3. The backend verifies the token using the `ClerkAuthentication` class.
4. If the token is valid, the user is authenticated and the request is processed.

### Backend Components

- **clerk_auth.py**: Contains utility functions for verifying Clerk JWT tokens.
- **authentication.py**: Contains the `ClerkAuthentication` class that handles authentication.
- **models.py**: The User model has been updated to include a `clerk_id` field.
- **views.py**: Contains a test endpoint to verify Clerk authentication.

## Testing

You can test the Clerk authentication by making a GET request to the `/api/users/clerk-test/` endpoint with a valid Clerk JWT token in the `Authorization` header:

```
Authorization: Bearer your-clerk-jwt-token
```

If the token is valid, you should receive a response like:

```json
{
  "message": "Clerk authentication successful!",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "clerk_id": "user_123456789"
  }
}
```

## Troubleshooting

### Common Issues

1. **Invalid Token**: Make sure the token is valid and has not expired.
2. **Missing Claims**: The token must include the `sub` and `email` claims.
3. **Configuration Mismatch**: Make sure the `CLERK_FRONTEND_API`, `CLERK_JWT_ISSUER`, and `CLERK_JWT_AUDIENCE` environment variables match your Clerk configuration.

### Debugging

If you encounter issues, check the following:

1. The token format and claims in the frontend.
2. The environment variables in the backend.
3. The logs for any error messages.

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [JWT.io](https://jwt.io/) - For decoding and verifying JWT tokens
- [Django REST Framework Documentation](https://www.django-rest-framework.org/) 