const deckotron = require('../dist/deckotron.js');
const path = require('path');

const indentGap = '  ';

function logGroup(groupItems, indent = ''){
  groupItems.forEach((slideOrGroup)=>{
    if(slideOrGroup instanceof deckotron.SlideGroup){
      console.log(`${indent}Group "${slideOrGroup.name}"`);
      console.log();
      logGroup(slideOrGroup._slides, (indent + indentGap));
    }
    else{
      console.log(`${indent}Slide "${slideOrGroup.name}":`);
      console.log(`${indent}- slide file: ${slideOrGroup.getSlideFile()}`);
      console.log(`${indent}- data files: `, slideOrGroup._dataFiles);
    }
    console.log();
  });
}


const group = new deckotron.SlideGroup(path.resolve(__dirname, 'slides'), 'root');
group.rescanDirForSlides()
    .then((groupItems)=>{
      logGroup(groupItems);
    })
    .catch((err)=>{
        console.error('Slide scan failed! ', err);
    });
