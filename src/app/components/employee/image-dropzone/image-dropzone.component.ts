import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { GlobalConstants } from '../../../constants/globalConstants';
import { DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-image-dropzone',
  templateUrl: './image-dropzone.component.html',
  styleUrls: ['./image-dropzone.component.css'],
  providers: [GlobalConstants],
  encapsulation: ViewEncapsulation.None
})
export class ImageDropzoneComponent implements OnInit {
  
  image_publicId:string = null;
  viewInit:boolean = false;
  isShowSavedImage:boolean = true;
  
  // intercept imageId onchange with setter
  @Input()
  set imagePublicId(imagePublicId: string) {
    console.log("image id changes: "+imagePublicId);
    this.image_publicId = imagePublicId;
    this.showSavedImage();
  }
  
  // output changed image id to parent component
  @Output() onPublicIdChanged = new EventEmitter<string>();
  @Output() uploadImageDone = new EventEmitter<boolean>();
  @ViewChild(DropzoneComponent) componentRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

  constructor(private globalConstants: GlobalConstants,
              private authenticationService:AuthenticationService,
              private employeeService: EmployeeService) { }

  ngOnInit() {}
  
  ngAfterViewInit(){
    this.viewInit = true;
    this.showSavedImage();
    if(this.authenticationService.isNormalEmployee()){
      this.disableDropZone();
    }
  }
  
  showSavedImage(){
    // check if view is not initialized, error will be thrown if emit dropzone event
    if(this.viewInit){
      let mockFile = { name: "profile.jpg", size: 12345, type: 'image/jpeg' };
      let tempUrl = this.globalConstants.dropzone_preview_url+this.image_publicId;
      
      // reset dropzone on every imagePublicId changed, no matther image is null or exist
      this.resetDropZone();
      // only set image to dropzone if imagePublicId exist
      if(this.image_publicId){
        this.componentRef.directiveRef.dropzone.emit("addedfile", mockFile);
        this.componentRef.directiveRef.dropzone.emit("thumbnail", mockFile, tempUrl);
        this.componentRef.directiveRef.dropzone.files.push(mockFile);
        this.componentRef.directiveRef.dropzone.emit("complete", mockFile);
      }
    }
  }
  
  resetDropZone(){
    this.componentRef.directiveRef.reset();
  }
  
  disableDropZone(){
    this.componentRef.directiveRef.dropzone.removeEventListeners();
  }
  
  onAddedfile(){
    // add remove button onclick listener to identify image changed or image added,
      // in order to prevent set null value to parent employee.profilepic in onDelete function
      let removeButton = Array.from(document.getElementsByClassName("dz-remove"))[0];
      if(removeButton){
      var _this = this;
      removeButton.addEventListener('click', function(event) {
          console.log("dropzone delete button clicked");
          _this.isShowSavedImage = false;
          _this.deleteImageByRemoveButton();
       });
      }
  }
    
  onUploadError(args: any) {
    console.log('onUploadError:', args);
  }

  onUploadSuccess(args: any) {
    console.log('onUploadSuccess:', args);
    // args = [File], {Cloudinary Upload API Callback}, ProgressEvent
    this.setImagePublicId(args[1].public_id);
    this.uploadImageDone.emit(true);
  }
  
  onSendingImage(args: any){
    this.uploadImageDone.emit(false);
    // args = [File], [XMLHttpRequest], [FormData]
    args[2].append('api_key', this.globalConstants.dropzone_api_key);
  	args[2].append('timestamp', Date.now() / 1000 | 0);
  	args[2].append('upload_preset', this.globalConstants.dropzone_upload_preset);
  	args[2].append('folder', this.globalConstants.dropzone_folder_profile);
  }
  
  onCancel(args: any){
    console.log("onCancel called");
    this.uploadImageDone.emit(true);
  }
  
  onDeleteImage(args: any){
    console.log("onDeleteImage: ",args);
    console.log("delete image public id: "+this.image_publicId);
  }
  
  deleteImageByRemoveButton(){
    console.log("deleteImageByRemoveButton public id: "+this.image_publicId);
    if(!this.isShowSavedImage){
      console.log("image public id reset");
      this.removeServerImage(this.image_publicId);
      this.setImagePublicId(null);
      
    }
  }
  
  removeServerImage(imagePublicId:string){
    console.log("remove file in server: "+imagePublicId);
    this.employeeService.deleteEmployeeProfile(imagePublicId).subscribe(
        result =>{
          console.log("remove result: ", result);
        },
        error =>{
          console.log("get employee failed: "+error.message);
          return false;
        });
  }
  
  onComplete(args: any) {
    // console.log('onComplete:', args);
  }
  
  setImagePublicId(imagePublicId){
    this.image_publicId = imagePublicId;
    this.onPublicIdChanged.emit(this.image_publicId);
  }

}
