import fs from 'fs';
import path from 'path';
import { makeName } from './utils.js';

const slideDataExtensions = /^\.(json|yaml)$/i;
const slideTemplateExtensions = /^\.nunj$/i;
const slideHtmlExtensions = /^\.html?$/i;
const slideMarkdownExtensions = /^\.md$/i;
const slideDirSuffix = /^\.slide$/i;


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


  _findRelatedFileInDir(extensionPattern){
    let dir = this._slideDir;
    if(!dir){
      dir = this._slideGroup._dir; // TODO: Add a getter?
    }

    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, dirContents) => {
        if(err){
          throw err;
        }

        // Find directory entries that are:
        // - not hidden
        // - have a name component matching this slide's name
        // - have an extension matching the supplied pattern
        const candidateEntries = dirContents.filter((entry) => {
          return (entry.charAt(0) !== '.')
            && (path.extname(entry).match(extensionPattern) !== null)
            && (makeName(entry) === this.name);
        });

        // Asynchronously stats each candidate to find
        // out whether or not it is a file
        Promise.all(
          candidateEntries.map((entry) => {
            return new Promise((resolve, reject) => {
              let fullPath = path.resolve(dir, entry);
              fs.stat(fullPath, (err, stats) => {
                if(err){
                  throw err;
                }

                if(stats.isFile()){
                  resolve(fullPath);
                }
                else{
                  resolve(false);
                }
              })
            })
          })
        ).then((checkedEntries) => {
          // Any dir entries that *looked* like a related file
          // but were actually a directory, will have resolved
          // to boolean false.
          // We therefore want to remove those entries from
          // checkedEntries and resolve this promise with the
          // remaining entries, which will be genuine file
          // paths.
          resolve(checkedEntries.filter(
            (entry) => {
              return entry !== false;
            })
          );
        });
      });
    });
  }


  discoverRelatedFiles(){
    let templateFileSearch = false;
    let htmlFileSearch = false;
    let markdownFileSearch = false;
    if(this._slideDir){
      // If dir, find slide file
      templateFileSearch = this._findRelatedFileInDir(slideTemplateExtensions);
      htmlFileSearch = this._findRelatedFileInDir(slideHtmlExtensions);
      markdownFileSearch = this._findRelatedFileInDir(slideMarkdownExtensions);
    }

    // Find data files
    let dataFileSearch = this._findRelatedFileInDir(slideDataExtensions);

    return Promise.all([
      templateFileSearch,
      htmlFileSearch,
      markdownFileSearch,
      dataFileSearch
    ]).then((results)=>{
      let [templateFiles, htmlFiles, markdownFiles, dataFiles] = results;

      if(templateFiles !== false && templateFiles.length > 0){
        this._tmplFile = templateFiles.sort()[0];
      }
      else if(htmlFiles !== false && htmlFiles.length > 0){
        this._htmlFile = htmlFiles.sort()[0];
      }
      else if(markdownFiles !== false && markdownFiles.length > 0){
        this._mdFile = markdownFiles.sort()[0];
      }

      this._dataFiles = dataFiles;

      // Return this slide
      return this;
    });
  }

}


Slide.templateExtensions = slideTemplateExtensions;
Slide.htmlExtensions = slideHtmlExtensions;
Slide.markdownExtensions = slideMarkdownExtensions;
Slide.dirSuffix = slideDirSuffix;

export default Slide;
