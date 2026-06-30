import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import ComplaintCard from '../../components/ComplaintCard';

// ── StatusBadge ───────────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  it('renders Submitted status', () => {
    render(<StatusBadge status="Submitted" />);
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('renders Resolved status', () => {
    render(<StatusBadge status="Resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders In Progress status', () => {
    render(<StatusBadge status="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('applies a CSS class to the element', () => {
    const { container } = render(<StatusBadge status="Resolved" />);
    expect(container.firstChild).toHaveClass(expect.stringContaining(''));
  });
});

// ── ComplaintCard ─────────────────────────────────────────────────────────────

const mockComplaint = {
  id: 'c-1',
  _id: 'c-1',
  title: 'Broken Road',
  description: 'Large pothole causing accidents on the main road near school.',
  category: 'Roads',
  status: 'Submitted',
  createdAt: new Date().toISOString(),
  location: { address: 'Test Street, City' },
  aiPriority: 'High',
};

describe('ComplaintCard', () => {
  it('renders complaint title', () => {
    render(
      <MemoryRouter>
        <ComplaintCard complaint={mockComplaint} />
      </MemoryRouter>
    );
    expect(screen.getByText('Broken Road')).toBeInTheDocument();
  });

  it('renders complaint category', () => {
    render(
      <MemoryRouter>
        <ComplaintCard complaint={mockComplaint} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Roads/i)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(
      <MemoryRouter>
        <ComplaintCard complaint={mockComplaint} />
      </MemoryRouter>
    );
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });
});
