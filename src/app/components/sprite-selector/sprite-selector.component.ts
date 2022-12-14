import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/interfaces/Subscriber';
import { EntityService } from 'src/app/services/entity.service';
import Spritesheet from 'src/GameEngine/GameComponents/Spritesheet';
import { SpritesheetData } from 'src/GameEngine/Interfaces/SpritesheetData';

@Component({
  selector: 'app-sprite-selector',
  templateUrl: './sprite-selector.component.html',
  styleUrls: ['./sprite-selector.component.css']
})
export class SpriteSelectorComponent implements OnInit, AfterViewInit, Subscriber {
  @ViewChild('spriteSquare') spriteSquare!: ElementRef;
  @ViewChild('spriteContainer') spriteContainer!: ElementRef;
  selectedImage:HTMLImageElement|undefined
  images:HTMLImageElement[] = []
  frameSize:number = 32
  private frameX:number = 0
  private frameY:number = 0
  flooredBox = true
  imageName:string = ""
  imageURL:string = ""

  constructor(public entity:EntityService) {
    this.subscribe()
   }
 

  ngAfterViewInit(): void {
    this.selectedImage = this.spriteContainer.nativeElement.firstElementChild
    for (let asset of this.entity.assetList){
      this.imageName = asset.id
      this.imageURL = asset.url
      let newImage = document.createElement("img")
      newImage.classList.add("hide")
      newImage.setAttribute("src", this.imageURL)
      newImage.setAttribute("id", this.imageName)
      this.spriteContainer.nativeElement.append(newImage)
      this.images.push(newImage)
    }



    this.setFrameSize(32)
    this.images = this.spriteContainer.nativeElement.getElementsByTagName('img')

    this.spriteContainer.nativeElement.addEventListener("mousedown", (e:any)=>{
      this.getImageCoordinates(e)
      this.moveSpriteSquare()
    })

  }

  ngOnInit(): void {

  }


  
  setFrameSize(size:number){
    console.log(size)
    this.frameSize = size
    this.spriteSquare.nativeElement.style.width = this.frameSize + "px"
    this.spriteSquare.nativeElement.style.height = this.frameSize + "px"
  }

  
  getImageCoordinates(e:any) {
    const { x, y } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    if (this.flooredBox){
      this.frameX = Math.floor(mouseX / this.frameSize)
      this.frameY = Math.floor(mouseY / this.frameSize)
    } else {
      this.frameX = (mouseX / this.frameSize)
      this.frameY = (mouseY / this.frameSize)
    }
    const sprite :SpritesheetData = {id:this.selectedImage?.id!, url:this.selectedImage?.src!, squareSize:this.frameSize}
    this.entity.setSpriteSheet(sprite, this.frameX, this.frameY)

 }

 moveSpriteSquare(){
  this.spriteSquare.nativeElement.style.left = this.frameX * this.frameSize + "px"
  this.spriteSquare.nativeElement.style.top = this.frameY * this.frameSize + "px"
}


setNewImage(name:string){
  let temp : HTMLImageElement | null = document.getElementById(name) as HTMLImageElement
  if (temp){
    this.selectedImage?.classList.add("hide")
    this.selectedImage = temp
    console.log(this.selectedImage)
    this.selectedImage?.classList.remove("hide")
  }

  
}


addNewImage(){
  if (this.imageName != "" && this.imageURL != ""){
    let newImage = document.createElement("img")
    newImage.classList.add("hide")
    newImage.setAttribute("src", this.imageURL)
    newImage.setAttribute("id", this.imageName)
    this.entity.assetList.push({id:this.imageName, url:this.imageURL})
    let first = this.spriteContainer.nativeElement.firstChild
    this.spriteContainer.nativeElement.insertBefore(newImage, first)
    this.setNewImage(this.imageName)
    this.imageName = ""
    this.imageURL = ""
  }
  
}

subscribe(): void {
  this.entity.addSubscriber(this)
}
subscriptionUpdate(): void {
  
}


toggleFlooredBox(state:boolean){
  this.flooredBox = state
  if (this.flooredBox){
    this.spriteSquare.nativeElement.style.outline = "3px solid rgb(27, 241, 44)"
  } else {
    this.spriteSquare.nativeElement.style.outline = "2px solid red"

  }
}









 


}
