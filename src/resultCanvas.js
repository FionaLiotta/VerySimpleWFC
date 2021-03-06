const config = require('./config.js');

export default function resultCanvas( res ) {
  let table = [];
  res.setup = () => {
    res.createCanvas(config.TABLE_SIZE*20, config.TABLE_SIZE*20);   
    res.noLoop();

  }

  res.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    table = props.table || [];
    res.redraw();
  }
  
  res.drawPossible = (row, col, xPx = 20, yPx = 20) => {
    let possible = table[row][col];
    if(possible && !Array.isArray(possible)){
      possible = [possible];
    }
    if(possible && possible.length > 0){
      for(const value of possible) {
        if(value){
          res.fill(`rgba(${config.colorsRGBA[value]})`);
          res.rect(col*xPx, row*yPx, xPx, yPx);
        }
      }
    }
    /* Draw with only solid colors.
    if(possible && possible.length === 1){
      res.fill(config.colorsRGBA[possible[0]]);
      res.rect(col*xPx, row*yPx, xPx, yPx);
    }
    */
    else {
      res.fill('gray');
      res.rect(col*xPx, row*yPx, xPx, yPx);
    }
    
  }

  res.draw = () => {
    for(let x = 0; x < table.length; x++){
      for(let y = 0; y < table[x].length; y++){
        res.drawPossible(x, y);
      }
    }
  }
}

export function ruleDisplay( res ){
  let rules = [];
  res.setup = () => {
    res.createCanvas(400,260);
  };
  
  res.myCustomRedrawAccordingToNewPropsHandler = ( props ) => {
    rules = props.rules;
    res.resizeCanvas(400, (rules.length * 65));
    res.noLoop();
  }
  
  const drawRuleText = (row, col, rule) => {
    let source, dest, dir;
    const offset = 40;
    switch(rule.dir){
      case 'u':
        dir = 'below';
        break;
      case 'd':
        dir = 'above';
        break;
      case 'l':
        dir = 'right of';
        break;
      case 'r':
        dir = 'left of';
        break;
      default:
        dir = '???'
        break;
    }
    switch(rule.source){
      case 1:
        source = 'Red';
        break;
      case 2:
        source = 'Green';
        break;
      case 3:
        source = 'Blue';
        break;
      default:
        source = '????';
        break;
    }
    switch(rule.dest){
      case 1:
        dest = 'Red';
        break;
      case 2:
        dest = 'Green';
        break;
      case 3:
        dest = 'Blue';
        break;
      default:
        dest = '????';
        break;
    }
    res.textSize(20);
    res.textAlign(res.LEFT, res.CENTER);
    res.fill('black');
    res.text(`${source} ${dir} ${dest}`, (col*20)+(col*40)+80, (row*20)+(row*40)+offset+10);
  }
  
  const drawRule = (row, col, rule) => {
    const offset = 40;
    switch(rule.dir){
      case 'u':
        res.fill(`rgba(${config.colorsRGBA[rule.dest]})`);
        res.rect((col*20)+(col*40), (row*20)+(row*40)+offset, 20, 20);
        res.fill(`rgba(${config.colorsRGBA[rule.source]})`);
        res.rect((col*20)+(col*40), (row*20)+20+(row*40)+offset, 20, 20);        
        break;
      case 'l':
        res.fill(`rgba(${config.colorsRGBA[rule.source]})`);
        res.rect((col*20)+20+(col*40), (row*20)+(row*40)+offset, 20, 20);
        res.fill(`rgba(${config.colorsRGBA[rule.dest]})`);
        res.rect((col*20)+(col*40), (row*20)+(row*40)+offset, 20, 20);
        break;
      case 'd':
        res.fill(`rgba(${config.colorsRGBA[rule.source]})`);
        res.rect((col*20)+(col*40), (row*20)+(row*40)+offset, 20, 20);
        res.fill(`rgba(${config.colorsRGBA[rule.dest]})`);
        res.rect((col*20)+(col*40), (row*20)+20+(row*40)+offset, 20, 20);
        break;
      case 'r':
        res.fill(`rgba(${config.colorsRGBA[rule.dest]})`);
        res.rect((col*20)+20+(col*40), (row*20)+(row*40)+offset, 20, 20);
        res.fill(`rgba(${config.colorsRGBA[rule.source]})`);
        res.rect((col*20)+(col*40), (row*20)+(row*40)+offset, 20, 20);
        break;
      default:
        break;
    }
    drawRuleText(row, col, rule);
    
  }
  
  res.mousePressed = ( ) => {
    res.redraw( );
  }
  
  res.draw = ( ) => {
    res.background(255);
    let row = 0;
    let drawnCount = 0;
    for(let i = 0; i < rules.length; i++){
      drawRule(row, 2, rules[i]);
      drawnCount++;
      row++;
    }
  }
}