import fs from 'fs';
import path from 'path';
import Slide from './slide.js';
import { makeName } from './utils.js';

const groupDirSuffix = /^\.group$/i;

class SlideGroup {

  constructor(dir, name, level = 1) {
    this._slides = [];
    this._dir = dir;
    this._level = level;
    this.name = name || makeName(dir);
  }


  /**
   * Searches for a slide or group owned by this group
   * and returns it, if found.
   *
   * @param {*} name
   */
  getSlideOrGroup(name) {
    return this._slides.find((slide) => {return name === slide.name});
  }


  /**
   * Adds the slideFile info to an existing slide in this group,
   * if one exists. Otherwise, creates a new slide and adds it
   * to this group.
   *
   * @param {*} fullPath
   * @param {*} slideFile
   */
  _createOrUpdateSlide(fullPath, slideFile) {
    let slide = this.getSlideOrGroup(makeName(fullPath));

    if(!slide){
      slide = new Slide(slideFile, this);
      this._slides.push(slide);
    }
    else{
      slide.addSlideFileOrDir(slideFile);
    }

    return slide;
  }


  /**
   * Checks if a given file or directory is a slide or
   * group. If so, it creates the respective slide or
   * group and adds it to this group.
   *
   * @param {*} fileOrDir
   */
  _processFileOrDir(fileOrDir) {
    return new Promise((resolve, reject) => {
      let fullPath = path.resolve(this._dir, fileOrDir);

      fs.stat(fullPath, (err, stats) => {
        if(err) {
          throw err;
        }
        let slideOrGroup = false;
        let ext = path.extname(fullPath);

        if (stats.isFile()) {
          let slideFile;

          if (ext.match(Slide.templateExtensions) !== null) {
            slideFile = { tmplFile: fullPath };
          }
          else if (ext.match(Slide.htmlExtensions) !== null) {
            slideFile = { htmlFile: fullPath };
          }
          else if (ext.match(Slide.markdownExtensions) !== null) {
            slideFile = { mdFile: fullPath };
          }

          if(slideFile){
            slideOrGroup = this._createOrUpdateSlide(fullPath, slideFile);
          }
        }
        else if (stats.isDirectory()) {
          if (ext.match(Slide.dirSuffix) !== null) {
            let slideFile = { slideDir: fullPath };
            slideOrGroup = this._createOrUpdateSlide(fullPath, slideFile);
          }
          else if (ext.match(groupDirSuffix) !== null) {
            slideOrGroup = new SlideGroup(fullPath, false, (this._level + 1));
            this._slides.push(slideOrGroup);
          }
        }

        resolve(slideOrGroup);
      });
    }).then((slideOrGroup) => {
      if(slideOrGroup instanceof Slide){
        // Return a Promise that resolves to the slide
        // once all its related files have been discovered.
        return slideOrGroup.discoverRelatedFiles();
      }
      else if(slideOrGroup instanceof SlideGroup){
        // Return a Promise that resolves to the subgroup
        // once it has rescanned itself for slides and groups.
        return slideOrGroup.rescanDirForSlides().then(()=>{
          return slideOrGroup;
        });
      }
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
        this._dir,
        (err, dirContents) => {
          if (err) {
            throw err;
          }

          const nonHiddenContents = dirContents.filter((file) => { return file.charAt(0) !== '.'; });

          // Check all files asynchronously
          Promise.all(
            nonHiddenContents.map((fileOrDir) => {return this._processFileOrDir(fileOrDir)})
          ).then((values) => {
            resolve(this._slides);
          });
        }
      );
    });
  }

}

export default SlideGroup;
