# Tesla Toolbox - Portfolio Version

A modern factory management tool built with Next.js, TypeScript, and Tailwind CSS. This is a portfolio version with limited Tesla references and mocked APIs to demonstrate the full functionality without requiring Internal Factory API access.

## Features

- **Authentication System**: Login with mock credentials
- **Factory Management Tools**:
  - Change Part Numbers
  - Complete to MMS
  - Mass Hold operations
  - Close Nonconformances
  - Move to Process
  - Module Configuration
- **Dynamic Forms**: Auto-populating dropdowns based on process/flow relationships
- **Modern UI**: Tesla-inspired design with responsive layout
- **Real-time Validation**: Form validation with helpful error messages

## Mock Data

The application uses comprehensive mock data to simulate the Factory API:

### Authentication

- **Demo User**: `demouser` / `demo123`

### Mock Things (TG1 format)

- `TG100000000001`
- `TG100000000002`
- `TG100000000003`
- `TG100000000004`
- `TG100000000005`

### Mock Processes

- **PROCESS_001**: Assembly Process
- **PROCESS_002**: Quality Control
- **PROCESS_003**: Packaging

### Mock Containments (AR format)

- `AR0000000001`
- `AR0000000002`
- `AR0000000003`
- `AR0000000004`
- `AR0000000005`

### Mock Part Numbers

- `1234567-01-A`
- `1234567-02-B`
- `1234567-03-C`
- `1234567-04-D`
- `1234567-05-E`

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run the Development Server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open the Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Login**
   Use the mock credentials:
   - Email: `demouser`
   - Password: `demo123`

## Usage

### Authentication

1. Navigate to the login page
2. Enter mock credentials
3. You'll be redirected to the main toolbox

### Factory Tools

#### Change Part Number

- Enter a valid part number (format: `0000000-00-X`)
- Enter one or more thing names (TG1 format)
- Submit to simulate part number changes

#### Mass Hold

- Enter thing names (comma-separated)
- Enter a containment name (AR format)
- Submit to place things on hold

#### Close NCs

- Enter thing names (comma-separated)
- Submit to close nonconformances

#### Move to Process

- Enter a thing name
- Press Enter to load available processes
- Select process, flow, and flow step
- Submit to move the thing

## Technical Details

### Architecture

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Tesla-inspired design
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context
- **API**: Next.js API routes with mock data

### Key Components

- **Dynamic Form System**: Configurable forms with auto-population
- **Dialog Manager**: Centralized dialog state management
- **Authentication**: Session-based auth with encrypted cookies
- **Validation**: Comprehensive input validation with helpful messages

### Mock API Structure

All internal Factory API calls have been replaced with mock implementations that:

- Validate inputs using the same schemas
- Return realistic response structures
- Simulate success/failure scenarios
- Maintain the same API contracts

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (mocked)
│   ├── (app)/             # Protected app routes
│   └── (auth)/            # Authentication routes
├── components/             # Reusable UI components
├── lib/                    # Utilities and configurations
│   ├── mock-data.ts       # Mock data and helpers
│   ├── schemas.ts         # Zod validation schemas
│   └── config/            # Application configuration
└── css/                   # Global styles
```

### Adding New Tools

1. Add dialog configuration in `src/lib/config/dialogs.ts`
2. Create corresponding API route in `src/app/api/v1/factory/`
3. Add mock data if needed in `src/lib/mock-data.ts`

## Portfolio Notes

This version has been stripped down for portfolio use:

- All external API dependencies removed
- Comprehensive mock data system implemented
- Maintains full functionality and user experience
- Demonstrates modern web development practices
- Shows understanding of factory management workflows

## License

This project is for portfolio demonstration purposes only.
