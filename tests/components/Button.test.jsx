import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders a button with children', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass(/bg-destructive/);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Cannot click</Button>);
    const button = screen.getByRole('button', { name: /cannot click/i });
    expect(button).toBeDisabled();
  });
});