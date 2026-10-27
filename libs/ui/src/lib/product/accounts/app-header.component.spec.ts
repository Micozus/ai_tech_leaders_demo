import { TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  it('shows the name, the person and their role', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.componentRef.setInput('userName', 'Ada Lovelace');
    fixture.componentRef.setInput('userRole', 'mentor');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('DevMentor');
    expect(root.textContent).toContain('Ada Lovelace');
    expect(root.textContent).toContain('Mentor');
    expect(root.querySelector('[aria-haspopup="menu"]')?.textContent).toContain(
      'Account',
    );
  });

  it('labels the other roles', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.componentRef.setInput('userName', 'Grace');
    fixture.componentRef.setInput('userRole', 'operator');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Operator',
    );
  });
});
