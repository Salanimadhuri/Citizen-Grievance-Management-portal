// Mock data for development and testing

export const mockUsers = {
  citizen: {
    id: 1,
    name: 'John Doe',
    email: 'citizen@example.com',
    phone: '+91 98765 43210',
    role: 'citizen',
  },
  officer: {
    id: 2,
    name: 'Jane Smith',
    email: 'officer@example.com',
    phone: '+91 98765 43211',
    role: 'officer',
    department: 'Public Works',
  },
  admin: {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+91 98765 43212',
    role: 'admin',
  },
};

export const mockComplaints = [
  {
    id: 1,
    title: 'Broken Street Light on MG Road',
    description: 'The street light near the park has been non-functional for 3 days, causing safety concerns.',
    category: 'Electricity',
    location: 'MG Road, Sector 14',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    status: 'In Progress',
    priority: 'High',
    citizen: 'John Doe',
    department: 'Electricity Board',
    officer: 'Jane Smith',
    images: [],
    createdAt: '2024-01-15T10:30:00Z',
    reviewedAt: '2024-01-15T14:00:00Z',
    assignedAt: '2024-01-16T09:00:00Z',
    inProgressAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 2,
    title: 'Pothole on Highway 24',
    description: 'Large pothole causing traffic issues and vehicle damage.',
    category: 'Road & Infrastructure',
    location: 'Highway 24, Near Exit 5',
    coordinates: { lat: 28.6200, lng: 77.2150 },
    status: 'Assigned',
    priority: 'High',
    citizen: 'John Doe',
    department: 'Public Works',
    createdAt: '2024-01-18T08:00:00Z',
    reviewedAt: '2024-01-18T10:00:00Z',
    assignedAt: '2024-01-18T15:00:00Z',
  },
  {
    id: 3,
    title: 'Water Leakage in Residential Area',
    description: 'Continuous water leakage from main pipeline causing water wastage.',
    category: 'Water Supply',
    location: 'Green Park, Block A',
    coordinates: { lat: 28.6100, lng: 77.2000 },
    status: 'Resolved',
    priority: 'Medium',
    citizen: 'John Doe',
    department: 'Water Department',
    createdAt: '2024-01-10T07:00:00Z',
    resolvedAt: '2024-01-14T16:00:00Z',
    feedbackSubmitted: false,
  },
];

export const mockDepartments = [
  {
    id: 1,
    name: 'Public Works',
    slaHours: 48,
    contactEmail: 'publicworks@gov.in',
  },
  {
    id: 2,
    name: 'Electricity Board',
    slaHours: 24,
    contactEmail: 'electricity@gov.in',
  },
  {
    id: 3,
    name: 'Water Department',
    slaHours: 36,
    contactEmail: 'water@gov.in',
  },
  {
    id: 4,
    name: 'Waste Management',
    slaHours: 48,
    contactEmail: 'waste@gov.in',
  },
];

export const mockOfficers = [
  {
    id: 1,
    name: 'Jane Smith',
    email: 'jane.smith@gov.in',
    phone: '+91 98765 43211',
    department: 'Public Works',
  },
  {
    id: 2,
    name: 'Robert Johnson',
    email: 'robert.j@gov.in',
    phone: '+91 98765 43213',
    department: 'Electricity Board',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@gov.in',
    phone: '+91 98765 43214',
    department: 'Water Department',
  },
];

export const mockAnalytics = {
  stats: {
    total: 156,
    pending: 23,
    inProgress: 45,
    resolved: 88,
  },
  byCategory: [
    { name: 'Road & Infrastructure', value: 45 },
    { name: 'Water Supply', value: 32 },
    { name: 'Electricity', value: 28 },
    { name: 'Waste Management', value: 25 },
    { name: 'Public Safety', value: 18 },
    { name: 'Other', value: 8 },
  ],
  byStatus: [
    { name: 'Submitted', value: 23 },
    { name: 'Under Review', value: 15 },
    { name: 'Assigned', value: 18 },
    { name: 'In Progress', value: 45 },
    { name: 'Resolved', value: 88 },
  ],
  resolutionRate: [
    { name: 'Jan', resolved: 45, pending: 12 },
    { name: 'Feb', resolved: 52, pending: 8 },
    { name: 'Mar', resolved: 48, pending: 15 },
  ],
  departmentPerformance: [
    { name: 'Public Works', avgResolutionTime: 42 },
    { name: 'Electricity', avgResolutionTime: 28 },
    { name: 'Water Dept', avgResolutionTime: 36 },
    { name: 'Waste Mgmt', avgResolutionTime: 45 },
  ],
  monthlyTrends: [
    { month: 'Jan', complaints: 45, resolved: 38 },
    { month: 'Feb', complaints: 52, resolved: 48 },
    { month: 'Mar', complaints: 48, resolved: 42 },
    { month: 'Apr', complaints: 55, resolved: 50 },
    { month: 'May', complaints: 60, resolved: 55 },
    { month: 'Jun', complaints: 58, resolved: 52 },
  ],
};

export const mockHeatmapData = [
  { lat: 28.6139, lng: 77.2090, weight: 5 },
  { lat: 28.6200, lng: 77.2150, weight: 8 },
  { lat: 28.6100, lng: 77.2000, weight: 3 },
  { lat: 28.6250, lng: 77.2200, weight: 6 },
  { lat: 28.6050, lng: 77.1950, weight: 4 },
];
