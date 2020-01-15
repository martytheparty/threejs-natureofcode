function ThreeDObject() {
    this.layers = [];
    this.threeObjects = [];
    this.cannonObjects = [];
    this.sphereLookup = {
        threeIndex: 0,
        cannonIndex: 0
    };
    this.platformLookup = {
        uiPlatformIndex: 1,
        rotatePlatformIndex: 2
    };

    return this;
} 