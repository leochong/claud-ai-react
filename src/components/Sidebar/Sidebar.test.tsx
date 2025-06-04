import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders children correctly', () => {
    const testContent = 'Test Child Content';
    render(
      <Sidebar>
        <div>{testContent}</div>
      </Sidebar>
    );
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('has correct width and layout', () => {
    const { container } = render(<Sidebar />);
    const sidebarElement = container.firstChild;
    
    expect(sidebarElement).toHaveStyle({
      width: '500px',
      height: '100%',
      flexDirection: 'column'
    });
  });
});