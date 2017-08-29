import fs from 'fs';
import path from 'path';
import Slide from './slide.js';
import { makeName } from './utils.js';


const slideTemplateExtensions = /^\.nunj$/i;
const slideHtmlExtensions = /^\.html?$/i;
const slideMarkdownExtensions = /^\.md$/i;

const slideDirSuffix = /^\.slide$/i;
const groupDirSuffix = /^\.group$/i;

class SlideGroup {

  constructor(dir, name, level = 1) {
    this.slides = [];
    this.dir = dir;
    this.level = level;
    this.name = name || makeName(dir);
  }


  getSlideOrGroup(name) {
    return this.slides.find((slide) => {return name === slide.name});
  }


  createOrUpdateSlide(fullPath, slideFile) {
    let slide = this.getSlideOrGroup(makeName(fullPath));

    if(!slide){
      slide = new Slide(slideFile, this);
      this.slides.push(slide);
    }
    else{
      slide.addFiles(slideFile);
    }

    return slide;
  }


  createOrUpdateSlideOrGroup(fileOrDir) {
    return new Promise((resolve, reject) => {
      let fullPath = path.resolve(this.dir, fileOrDir);

      fs.stat(fullPath, (err, stats) => {
        if(err) {
          reject(err);
          return;
        }
        let slideOrGroup = false;
        let ext = path.extname(fullPath);

        if (stats.isFile()) {
          let slideFile;

          if (ext.match(slideTemplateExtensions) !== null) {
            slideFile = { tmplFile: fullPath };
          }
          else if (ext.match(slideHtmlExtensions) !== null) {
            slideFile = { htmlFile: fullPath };
          }
          else if (ext.match(slideMarkdownExtensions) !== null) {
            slideFile = { mdFile: fullPath };
          }

          if(slideFile){
            slideOrGroup = this.createOrUpdateSlide(fullPath, slideFile);
          }
        }
        else if (stats.isDirectory()) {
          if (ext.match(slideDirSuffix) !== null) {
            let slideFile = { slideDir: fullPath };
            slideOrGroup = this.createOrUpdateSlide(fullPath, slideFile);
          }
          else if (ext.match(groupDirSuffix) !== null) {
            slideOrGroup = new SlideGroup(fullPath, false, (this.level + 1));
            this.slides.push(slideOrGroup);
          }
        }

        resolve(slideOrGroup);
      });
    });
  }





  /**
   * Retrieves the contents of a directory, sorted by name and with
   * hidden files excluded.
   *
   * @return {Promise}  Resolves to an array containing the sorted names
   *                    of all, non-hidden files and folders inside dir.
   */
  rescanDirForSlides() {
    return new Promise((resolve, reject) => {
      fs.readdir(
        this.dir,
        (err, dirContents) => {
          if (err) {
            reject(err);
            return;
          }

          const nonHiddenContents = dirContents.filter((file) => { return file.charAt(0) !== '.'; });

          // Check all files asynchronously
          Promise.all(
            nonHiddenContents.map((fileOrDir) => {return this.createOrUpdateSlideOrGroup(fileOrDir)})
          )
            .then((values) => {resolve(this.slides);})
            .catch((err) => {reject(err);});
        }
      );
    });
  }

}

export default SlideGroup;
