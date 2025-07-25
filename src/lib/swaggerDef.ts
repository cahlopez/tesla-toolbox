// swaggerDef.ts
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NPI Website API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000", // Adjust this based on your deployment environment
        description: "Development Server",
      },
      // You can add production/staging servers here
      // {
      //   url: 'https://your-production-app.com',
      //   description: 'Production Server',
      // },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme.",
        },
      },
      schemas: {
        // Define reusable schemas here (e.g., for User, Product, etc.) Examples below:
        // User: {
        //   type: 'object',
        //   properties: {
        //     id: { type: 'string', format: 'uuid', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
        //     firstName: { type: 'string', example: 'Jane' },
        //     lastName: { type: 'string', example: 'Doe' },
        //     email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
        //     role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        //     createdAt: { type: 'string', format: 'date-time' },
        //   },
        // },
        // NewUserInput: {
        //     type: 'object',
        //     properties: {
        //         firstName: { type: 'string', example: 'John' },
        //         lastName: { type: 'string', example: 'Smith' },
        //         email: { type: 'string', format: 'email', example: 'john.smith@example.com' },
        //         password: { type: 'string', format: 'password', example: 'password123' },
        //     },
        //     required: ['firstName', 'lastName', 'email', 'password'],
        // }
      },
    },
  },
  apis: [
    "./src/app/api/v1/**/*.ts", // Path to your API routes (recursive search)
    // Add other paths if your API logic is in separate files with JSDoc
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

// If you want to log it to console or save to a file for inspection
// console.log(JSON.stringify(swaggerSpec, null, 2));
