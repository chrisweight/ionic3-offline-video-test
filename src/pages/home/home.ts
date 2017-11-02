import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { Platform, Content } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { normalizeURL } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;
  
  urls: string[] = [
    'http://f1.media.brightcove.com/4/1852113022001/1852113022001_1964328863001_pr-001-ch-05-sl-01.mp4?pubId=1852113022001&videoId=1964302431001',
    'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    'http://localhost:8080/var/mobile/Containers/Data/Application/FD9BDB20-E922-4F08-A943-D85400214814/Library/NoCloud/BigBuckBunny_320x180.mp4'
  ];

  url: string;
  src: SafeUrl; // string;
  downloading: boolean = false;
  transfer: FileTransferObject;
  downloadButtonText: string = 'Download!';

  constructor(
    public navCtrl: NavController, 
    public sanitizer: DomSanitizer,
    public platform: Platform,
    public fileTransfer: FileTransfer, 
    public file: File) {

      this.url = this.urls[2];
      // er....this works???
      this.src = this.url;

      console.log(this.url);

      this.platform
      .ready()
      .then(() => {
        // this.checkfileExists();
      })
  }

  parseFileName(url: string): string {
   if (url == null) {
     return null;
   }

   let _name = url.split('/').pop();

   if (_name.indexOf('?') > -1) {
     _name = _name.split('?')[0];
   }

   return _name;
  }

checkfileExists() {
  let fileName: string = this.parseFileName(this.url);
  
  this.file
    .resolveLocalFilesystemUrl(this.file.dataDirectory+ '/' + fileName)
    .then(entry => this.onComplete(entry))
    .catch(error => console.error(error));
}

onTap($event) {
    console.log('HomePage.onTap()', $event);

    this.downloading = true;
    this.downloadButtonText = 'Downloading!';

    let fileName: string = this.parseFileName(this.url);
    let transfer: FileTransferObject = this.fileTransfer.create();

    transfer.download(this.url, this.file.dataDirectory + '/' + fileName)
      .then(entry => this.onComplete(entry))
      .catch(error => {
        console.error(error);
        this.downloading = false;
      })
  }

  onComplete(entry) {
    this.downloadButtonText = 'Downloaded!';

    // So this _should_ work, according to https://ionicframework.com/docs/wkwebview/. Doesn't.
    let _path =  normalizeURL(entry.toURL());
    console.log('normalised entry.toURL(): ', _path);
    // this.src = _path; 
    // --

    // This doesn't like to work either.
    this.src = this.sanitizer.bypassSecurityTrustUrl(_path); 

    console.log('onComplete!', entry, this.src);  
  }

}