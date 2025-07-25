// Mock data
export const MOCK_USERS = [
  {
    email: "demo@email.com",
    password: "demo123",
    userId: "user_001",
    actorid: "1",
    username: "demouser",
  },
  {
    email: "admin@email.com",
    password: "admin123",
    userId: "user_002",
    actorid: "2",
    username: "adminuser",
  },
];

export const MOCK_PROCESSES = {
  PROCESS_001: {
    name: "Assembly Process",
    flows: [
      {
        name: "FLOW_001",
        state: "DEVELOPMENT",
        flowSteps: [
          { name: "STEP_001", description: "Initial Assembly" },
          { name: "STEP_002", description: "Quality Check" },
          { name: "STEP_003", description: "Final Assembly" },
        ],
      },
      {
        name: "FLOW_002",
        state: "TESTING",
        flowSteps: [
          { name: "STEP_004", description: "Testing Phase 1" },
          { name: "STEP_005", description: "Testing Phase 2" },
        ],
      },
    ],
  },
  PROCESS_002: {
    name: "Quality Control",
    flows: [
      {
        name: "FLOW_003",
        state: "DEVELOPMENT",
        flowSteps: [
          { name: "STEP_006", description: "Visual Inspection" },
          { name: "STEP_007", description: "Functional Test" },
        ],
      },
    ],
  },
  PROCESS_003: {
    name: "Packaging",
    flows: [
      {
        name: "FLOW_004",
        state: "DEVELOPMENT",
        flowSteps: [
          { name: "STEP_008", description: "Packaging Setup" },
          { name: "STEP_009", description: "Final Packaging" },
        ],
      },
    ],
  },
};

export const MOCK_THINGS = [
  "TG100000000001",
  "TG100000000002",
  "TG100000000003",
  "TG100000000004",
  "TG100000000005",
];

export const MOCK_PART_NUMBERS = [
  "1234567-01-A",
  "1234567-02-B",
  "1234567-03-C",
  "1234567-04-D",
  "1234567-05-E",
];

export const MOCK_CONTAINMENTS = [
  "AR0000000001",
  "AR0000000002",
  "AR0000000003",
  "AR0000000004",
  "AR0000000005",
];

export const MOCK_NONCONFORMANCES = [
  {
    id: "NC001",
    thingName: "TG100000000001",
    description: "Minor surface defect",
    status: "OPEN",
  },
  {
    id: "NC002",
    thingName: "TG100000000002",
    description: "Component misalignment",
    status: "OPEN",
  },
  {
    id: "NC003",
    thingName: "TG100000000003",
    description: "Electrical connection issue",
    status: "OPEN",
  },
];

// Helper function to generate JWT-like token
export const generateMockToken = (userId: string, username: string) => {
  // Use only base64url characters, no padding, no plus or slash
  const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // {"alg":"HS256","typ":"JWT"} base64url
  const payload = btoa(
    JSON.stringify({
      actorid: userId,
      sub: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 720 * 60,
    }),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const signature = "mock_signature"; // simple, deterministic, and matches regex
  return `${header}.${payload}.${signature}`;
};

// Helper function to validate mock credentials
export const validateMockCredentials = (username: string, password: string) => {
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    return {
      token: generateMockToken(user.userId, user.username),
      user: {
        userId: user.userId,
        username: user.username,
        actorid: user.actorid,
      },
    };
  }
  return null;
};

// Helper function to get process options for a thing
export const getProcessOptionsForThing = (thingName: string) => {
  return Object.keys(MOCK_PROCESSES).map((processId) => ({
    label: MOCK_PROCESSES[processId as keyof typeof MOCK_PROCESSES].name,
    value: processId,
  }));
};

// Helper function to get flow options for a process
export const getFlowOptionsForProcess = (processName: string) => {
  const process = Object.values(MOCK_PROCESSES).find(
    (process) => process.name === processName,
  );
  if (!process) return [];

  return process.flows
    .filter((flow) => flow.state !== "PRODUCTION")
    .map((flow) => ({
      label: flow.name,
      value: flow.name,
    }));
};

// Helper function to get flow step options for a flow
export const getFlowStepOptionsForFlow = (
  processName: string,
  flowName: string,
) => {
  const process = Object.values(MOCK_PROCESSES).find(
    (process) => process.name === processName,
  );
  if (!process) return [];

  const flow = process.flows.find((f) => f.name === flowName);
  if (!flow) return [];

  return flow.flowSteps.map((step) => ({
    label: step.description,
    value: step.name,
  }));
};
