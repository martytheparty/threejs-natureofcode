function ThreeDObject() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.threeObjects = [];
    this.camera = {};
    this.cube = {
        three: {},
        cannon: {}
    };
    this.setX = (x) => {
        this.x = x;
    }; 
    this.setY = (y) => {
        this.y = y;
    }; 
    this.setZ = (z) => {
        this.z = z;
    }; 
    return this;
} 