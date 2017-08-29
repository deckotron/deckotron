const deckotron = require('../dist/deckotron.js');
const path = require('path');

const group = new deckotron.SlideGroup(path.resolve(__dirname, 'slides'), 'root');
group.rescanDirForSlides()
    .then((contents)=>{
        console.log('Slides dir contains: ', contents);
    })
    .catch((err)=>{
        console.error('Slide scan failed! ', err);
    });
