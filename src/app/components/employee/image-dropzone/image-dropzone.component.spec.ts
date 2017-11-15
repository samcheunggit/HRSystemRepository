import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDropzoneComponent } from './image-dropzone.component';

describe('ImageDropzoneComponent', () => {
  let component: ImageDropzoneComponent;
  let fixture: ComponentFixture<ImageDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
