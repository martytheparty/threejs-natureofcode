!function(e){var t={};function o(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=t,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(i,n,function(t){return e[t]}.bind(null,n));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";var i,n;o.r(t),function(e){e[e.Ambient=0]="Ambient",e[e.Hemisphere=1]="Hemisphere",e[e.Directional=2]="Directional",e[e.Point=3]="Point",e[e.Spot=4]="Spot"}(i||(i={})),function(e){e[e.Basic=0]="Basic",e[e.Lambert=1]="Lambert",e[e.Phong=2]="Phong",e[e.Standard=3]="Standard"}(n||(n={})),function(e){var t=e();t.physics=new CANNON.World,t.scenes.forEach((function(e){e.threeData.scene=new THREE.Scene,e.threeData.ele=document.getElementById(e.position),e.threeData.camera=new THREE.PerspectiveCamera(75,1,.1,1e4),e.threeData.camera.up.set(e.threeData.up.x,e.threeData.up.y,e.threeData.up.z),e.threeData.camera.position.set(e.threeData.position.x,e.threeData.position.y,e.threeData.position.z),e.threeData.camera.lookAt(e.threeData.look.x,e.threeData.look.y,e.threeData.look.z),e.threeData.platforms.forEach((function(t){var o=new THREE.BoxGeometry(t.dimensions.width,t.dimensions.depth,t.dimensions.height),i=new THREE.MeshNormalMaterial;"Standard"===t.material.type?i=new THREE.MeshStandardMaterial:"Phong"===t.material.type?i=new THREE.MeshPhongMaterial({color:t.material.color}):"Lambert"===t.material.type&&(i=new THREE.MeshLambertMaterial({color:t.material.color}));var n=new THREE.Mesh(o,i);n.rotation.x=t.rotateAngle.x,n.rotation.y=t.rotateAngle.y,n.rotation.z=t.rotateAngle.z,n.position.set(t.position.x,t.position.y,t.position.z),i.color.set(t.material.color),e.threeData.scene.add(n)})),e.threeData.lights.forEach((function(t){if("Ambient"===t.type){var o=new THREE.AmbientLight(t.color);e.threeData.scene.add(o)}else if("Point"===t.type){var i=t.intensity||1;if((o=new THREE.PointLight(t.color,i,100,1)).position.set(t.position.x,t.position.y,t.position.z),e.threeData.scene.add(o),t.helper){var n=t.helperSize||.5,r=new THREE.PointLightHelper(o,n);e.threeData.scene.add(r)}}else if("Spot"===t.type){i=1|t.intensity;(o=new THREE.SpotLight(t.color,i,100,1)).position.set(t.position.x,t.position.y,t.position.z),e.threeData.scene.add(o)}else if("Directional"===t.type){o=new THREE.DirectionalLight(t.color,t.intensity);t.position&&o.position.set(t.position.x,t.position.y,t.position.z),e.threeData.scene.add(o)}})),e.threeData.renderer=new THREE.WebGLRenderer({antialias:!0,canvas:e.threeData.ele}),e.threeData.renderer.setSize(e.threeData.width,e.threeData.height),e.threeData.renderer.render(e.threeData.scene,e.threeData.camera)}))}((function(){var e={scenes:[],physics:{}};return function(e){e.scenes.push({position:"top",threeData:{scene:{},ele:{},camera:{},renderer:{},width:600,height:600,position:{x:0,y:5,z:0},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},platforms:[{dimensions:{width:.3,height:4.8,depth:4.8},position:{x:2,y:0,z:0},rotateAngle:{x:Math.PI/4,y:0,z:Math.PI/4},material:{type:"Lambert",color:16776960}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:0,y:0,z:0},rotateAngle:{x:0,y:Math.PI/6,z:0},material:{type:"Standard",color:16764108}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:-1,y:0,z:0},rotateAngle:{x:0,y:0,z:Math.PI/6},material:{type:"Phong",color:13421823}}],lights:[{type:"Point",color:16777215,position:{x:0,y:4,z:3}},{type:"Point",color:16777215,position:{x:8,y:0,z:0}}]}}),e.scenes.push({position:"left",threeData:{scene:{},ele:{},camera:{},renderer:{},width:200,height:200,position:{x:0,y:2,z:2},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},platforms:[{dimensions:{width:.5,height:4,depth:4},position:{x:1,y:0,z:0},rotateAngle:{x:0,y:0,z:0},material:{type:"Standard",color:13434828}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:0,y:0,z:0},rotateAngle:{x:0,y:0,z:0},material:{type:"Standard",color:13434828}},{dimensions:{width:4,height:4,depth:.5},position:{x:-1,y:0,z:0},rotateAngle:{x:0,y:0,z:Math.PI/2},material:{type:"Standard",color:16777215}}],lights:[{type:"Ambient",color:65280},{type:"Spot",color:16777215,position:{x:0,y:0,z:1}}]}}),e.scenes.push({position:"player",threeData:{scene:{},ele:{},camera:{},renderer:{},width:200,height:200,position:{x:2,y:2,z:2},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},platforms:[{dimensions:{width:.5,height:.5,depth:.5},position:{x:1,y:0,z:0},rotateAngle:{x:Math.PI/6,y:0,z:0},material:{type:"Standard",color:13434828}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:0,y:0,z:0},rotateAngle:{x:0,y:Math.PI/6,z:0},material:{type:"Standard",color:13434828}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:-1,y:0,z:0},rotateAngle:{x:0,y:0,z:Math.PI/6},material:{type:"Standard",color:13434828}}],lights:[{type:"Ambient",color:16777215},{type:"Directional",color:16711680,intensity:.5,position:{x:1,y:0,z:0}}]}}),e.scenes.push({position:"third",threeData:{scene:{},ele:{},camera:{},renderer:{},width:200,height:200,position:{x:0,y:2,z:2},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},platforms:[{dimensions:{width:.5,height:.5,depth:.5},position:{x:1,y:0,z:0},rotateAngle:{x:0,y:0,z:0},material:{type:"Standard",color:16777215}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:0,y:0,z:0},rotateAngle:{x:0,y:0,z:0},material:{type:"Standard",color:16777215}},{dimensions:{width:.5,height:.5,depth:.5},position:{x:-1,y:0,z:0},rotateAngle:{x:0,y:0,z:0},material:{type:"Standard",color:16777215}}],lights:[{type:"Point",color:16711680,position:{x:0,y:0,z:1},helper:!0,helperSize:.1,intensity:.8},{type:"Point",color:65280,position:{x:0,y:.5,z:0},helper:!0,helperSize:.1,intensity:1}]}})}(e),e}))}]);