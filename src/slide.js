import { makeName } from './utils.js';

const slideDataExtensions = /^\.(json|yaml)$/i;

class Slide {

  constructor(slideFile, slideGroup) {
    this._slideGroup = slideGroup;
    this._dataFiles = [];
    this.addSlideFileOrDir(slideFile);
    this.name = makeName(this.getSlideFile() || this._slideDir);
  }



  addSlideFileOrDir({tmplFile, mdFile, htmlFile, slideDir}){
    this._tmplFile = tmplFile || this._tmplFile;
    this._htmlFile = htmlFile || this._htmlFile;
    this._mdFile = mdFile || this._mdFile;
    this._slideDir = slideDir || this._slideDir;
  }

  getSlideFile(){
    return this._tmplFile || this._htmlFile || this._mdFile;
  }

}

export default Slide;
