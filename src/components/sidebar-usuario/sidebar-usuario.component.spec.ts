import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUsuarioComponent } from './sidebar-usuario.component';

describe('SidebarUsuarioComponent', () => {
  let component: SidebarUsuarioComponent;
  let fixture: ComponentFixture<SidebarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
