

let sizing = () => {

    const mainCanvas = document.getElementById('main');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const frontCanvas = document.getElementById('front');
    const leftCanvas = document.getElementById('left');
    const ballCanvas = document.getElementById('ball');
    
    let dimension = .5*window.innerHeight;
    let smallDimension = .333*dimension;
    
    /* 
      Represents the maximum possible height window.innerHeight = dimension + dimension/3;
      IH = x + x/3
      IH = 4x/3
      3*IH/4 = x
      x = 3*IH/4
    */
    
    if (smallDimension*4 < 3*height/4) {
        dimension = dimension * height/(smallDimension*4)*.95;
        if (dimension > width) {
            dimension = width*.35;
        }
        smallDimension = .333*dimension;
    }
    
    mainCanvas.width = dimension;
    mainCanvas.height = dimension;
    
    
    frontCanvas.width = smallDimension;
    frontCanvas.height = smallDimension;
    
    leftCanvas.width = smallDimension;
    leftCanvas.height = smallDimension;
    ballCanvas.width = smallDimension;
    ballCanvas.height = smallDimension;

}

sizing();

window.addEventListener('resize', sizing);