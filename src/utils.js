import path from 'path';

const slideNameRegex = /^(\d+?\-)?(.+)(\.\w+)$/;

export function makeName(fileOrDir) {
    let basename = path.basename(fileOrDir);
    let matches = basename.match(slideNameRegex);
    if(matches !== null){
      return matches[2]; // basename is 2nd matching group
    }
    else{
      throw `"${basename} is not a valid filename for a slide or group."`;
    }
  }
