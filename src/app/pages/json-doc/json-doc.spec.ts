import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonDoc } from './json-doc';

describe('JsonDoc', () => {
  let component: JsonDoc;
  let fixture: ComponentFixture<JsonDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonDoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonDoc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
