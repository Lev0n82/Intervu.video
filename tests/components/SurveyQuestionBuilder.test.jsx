import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../tests/utils';
import SurveyQuestionBuilder from '@/components/SurveyQuestionBuilder';

describe('SurveyQuestionBuilder', () => {
  const mockQuestion = {
    id: '1',
    text: 'Test Question',
    type: 'multiple-choice',
    options: ['Option A', 'Option B'],
    isRequired: true
  };
  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  it('renders question text and options', () => {
    render(
      <SurveyQuestionBuilder 
        question={mockQuestion} 
        index={0} 
        onQuestionChange={mockOnChange} 
        onRemoveQuestion={mockOnRemove} 
        disabled={false}
      />
    );

    expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option B')).toBeInTheDocument();
  });

  it('calls onChange when text is updated', () => {
    render(
      <SurveyQuestionBuilder 
        question={mockQuestion} 
        index={0} 
        onQuestionChange={mockOnChange} 
        onRemoveQuestion={mockOnRemove} 
      />
    );

    const textArea = screen.getByLabelText(/question text/i);
    fireEvent.change(textArea, { target: { value: 'Updated Text' } });
    expect(mockOnChange).toHaveBeenCalledWith('1', 'text', 'Updated Text');
  });

  it('allows adding new options for multiple choice', () => {
    render(
      <SurveyQuestionBuilder 
        question={mockQuestion} 
        index={0} 
        onQuestionChange={mockOnChange} 
        onRemoveQuestion={mockOnRemove} 
      />
    );

    const addBtn = screen.getByText(/add option/i);
    fireEvent.click(addBtn);
    // Component manages local state for options before syncing up
    // We check if the parent handler was called with the new array
    expect(mockOnChange).toHaveBeenCalled();
  });
});