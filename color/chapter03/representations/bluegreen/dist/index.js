!function(e){var t={};function o(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=t,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(i,a,function(t){return e[t]}.bind(null,a));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";var i,a,n;o.r(t),function(e){e[e.Ambient=0]="Ambient",e[e.Hemisphere=1]="Hemisphere",e[e.Directional=2]="Directional",e[e.Point=3]="Point",e[e.Spot=4]="Spot"}(i||(i={})),function(e){e[e.Basic=0]="Basic",e[e.Lambert=1]="Lambert",e[e.Phong=2]="Phong",e[e.Standard=3]="Standard"}(a||(a={})),function(e){e[e.Double=0]="Double",e[e.Front=1]="Front",e[e.Back=2]="Back"}(n||(n={}));var r=[],s=[{radius:1.3,position:{x:0,y:0,z:0},material:{type:"Lambert",color:2443330},widthSegments:32,heightSegments:32,rotateAngle:{x:0,y:0,z:0}}],c=[{dimensions:{width:6,height:1,depth:8},position:{x:0,y:0,z:-2.5},rotateAngle:{x:0,y:0,z:0},receiveShadow:!0,material:{type:"Lambert",color:16777215}},{dimensions:{width:2,height:2,depth:2},position:{x:0,y:0,z:0},rotateAngle:{x:0,y:0,z:0},receiveShadow:!0,material:{type:"Lambert",color:2443330}}],l=[{type:"Point",color:16777215,position:{x:0,y:0,z:5},intensity:1},{type:"Point",color:16777215,position:{x:0,y:5,z:0},intensity:1},{type:"Point",color:16777215,position:{x:0,y:-5,z:0},intensity:1},{type:"Point",color:16777215,position:{x:5,y:0,z:0},intensity:1},{type:"Point",color:16777215,position:{x:-5,y:0,z:0},intensity:1}],p={gravity:-3,world:{}};var d=function(e){var t=e(),o=new CANNON.World;t.physics={world:o},o.gravity.set(0,0,t.scenes[0].objectData.physicsWorld.gravity),o.broadPhase=new CANNON.NaiveBroadphase;var i=[];return t.scenes.forEach((function(e,a){e.objectData.physicsWorld.world=o,e.objectData.scene=new THREE.Scene,e.objectData.ele=document.getElementById(e.position),e.objectData.camera=new THREE.PerspectiveCamera(75,1,.1,1e4),e.objectData.camera.up.set(e.objectData.up.x,e.objectData.up.y,e.objectData.up.z),e.objectData.camera.position.set(e.objectData.position.x,e.objectData.position.y,e.objectData.position.z),e.objectData.camera.lookAt(e.objectData.look.x,e.objectData.look.y,e.objectData.look.z),e.objectData.planes&&e.objectData.planes.forEach((function(t){var o=new THREE.PlaneGeometry(t.width,t.height,t.heightSegments,t.widthSegments),i=new THREE.MeshPhongMaterial({color:t.material.color,side:THREE.DoubleSide}),a=new THREE.Mesh(o,i);a.rotation.x=t.rotateAngle.x,a.rotation.y=t.rotateAngle.y,a.rotation.z=t.rotateAngle.z,e.objectData.scene.add(a)})),e.objectData.spheres&&(t.threeBodies.push([]),e.objectData.spheres.forEach((function(o,n){var r=new THREE.SphereGeometry(o.radius,o.heightSegments,o.widthSegments),s=new THREE.MeshNormalMaterial;"Standard"===o.material.type?s=new THREE.MeshStandardMaterial:"Phong"===o.material.type?s=new THREE.MeshPhongMaterial({color:o.material.color}):"Lambert"===o.material.type&&(s=new THREE.MeshLambertMaterial({color:o.material.color}));var c=new THREE.Mesh(r,s);if(s.color.set(o.material.color),c.rotation.x=o.rotateAngle.x,c.rotation.y=o.rotateAngle.y,c.rotation.z=o.rotateAngle.z,c.position.set(o.position.x,o.position.y,o.position.z),e.objectData.scene.add(c),o.uiBody=c,console.log("adding: "+a+"-"+n,o.uiBody.uuid),0===a){var l=o.mass,p=o.radius,d=new CANNON.Sphere(p),h=new CANNON.Body({mass:l,shape:d});h.position.set(o.position.x,o.position.y,o.position.z),e.objectData.physicsWorld.world.addBody(h),o.physicsBody=h,i[n]=h}else o.physicsBody=i[n];t.threeBodies[a].push({type:"sphere",body:o.uiBody,physics:o.physicsBody})}))),e.objectData.platforms.forEach((function(t){var o=new THREE.BoxGeometry(t.dimensions.width,t.dimensions.depth,t.dimensions.height),i=new THREE.MeshNormalMaterial;"Standard"===t.material.type?i=new THREE.MeshStandardMaterial:"Phong"===t.material.type?i=new THREE.MeshPhongMaterial({color:t.material.color}):"Lambert"===t.material.type&&(i=new THREE.MeshLambertMaterial({color:t.material.color}));var n=new THREE.Mesh(o,i);if(t.receiveShadow&&(n.receiveShadow=!0),n.rotation.x=t.rotateAngle.x,n.rotation.y=t.rotateAngle.y,n.rotation.z=t.rotateAngle.z,n.position.set(t.position.x,t.position.y,t.position.z),i.color.set(t.material.color),e.objectData.scene.add(n),0===a){var r=new CANNON.Vec3(.5*t.dimensions.width,.5*t.dimensions.depth,.5*t.dimensions.height),s=new CANNON.Box(r),c=new CANNON.Body({mass:0});c.addShape(s),c.position.set(t.position.x,t.position.y,t.position.z),e.objectData.physicsWorld.world.addBody(c),console.log(e.objectData.physicsWorld.world.addBody)}})),e.objectData.lights.forEach((function(t){if("Ambient"===t.type){var o=new THREE.AmbientLight(t.color);e.objectData.scene.add(o)}else if("Point"===t.type){var i=t.intensity||1;if((o=new THREE.PointLight(t.color,i,100,1)).position.set(t.position.x,t.position.y,t.position.z),e.objectData.scene.add(o),t.helper){var a=t.helperSize||.5,n=new THREE.PointLightHelper(o,a);e.objectData.scene.add(n)}}else if("Spot"===t.type){i=1|t.intensity;if((o=new THREE.SpotLight(t.color,i,100,1)).position.set(t.position.x,t.position.y,t.position.z),e.objectData.scene.add(o),t.helper){var r=new THREE.SpotLightHelper(o);e.objectData.scene.add(r)}}else if("Directional"===t.type){o=new THREE.DirectionalLight(t.color,t.intensity);if(t.position&&o.position.set(t.position.x,t.position.y,t.position.z),t.castShadow&&(o.castShadow=!0),t.helper){a=t.helperSize||.5,r=new THREE.DirectionalLightHelper(o,a);e.objectData.scene.add(r)}e.objectData.scene.add(o)}})),e.objectData.renderer=new THREE.WebGLRenderer({antialias:!0,canvas:e.objectData.ele}),e.objectData.renderer.setSize(e.objectData.width,e.objectData.height),e.objectData.renderer.setClearColor(16445660,1),e.objectData.renderer.render(e.objectData.scene,e.objectData.camera)})),t}((function(){var e={scenes:[],threeBodies:[]};return function(e){e.scenes.push({position:"top",objectData:{physicsWorld:p,scene:{},ele:{},camera:{},renderer:{},width:400,height:400,position:{x:2.5,y:0,z:0},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},planes:r,spheres:s,platforms:c,lights:l}}),e.scenes.push({position:"left",objectData:{physicsWorld:p,scene:{},ele:{},camera:{},renderer:{},width:400,height:400,position:{x:0,y:0,z:12},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},planes:r,spheres:s,platforms:c,lights:l}}),e.scenes.push({position:"player",objectData:{physicsWorld:p,scene:{},ele:{},camera:{},renderer:{},width:400,height:400,position:{x:8,y:-6,z:0},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},planes:r,spheres:s,platforms:c,lights:l}}),e.scenes.push({position:"third",objectData:{physicsWorld:p,scene:{},ele:{},camera:{},renderer:{},width:400,height:400,position:{x:-8,y:6,z:0},up:{x:0,y:0,z:1},look:{x:0,y:0,z:0},planes:r,spheres:s,platforms:c,lights:l}})}(e),e})),h=new Date,y=h.getTime(),b=y;setInterval((function(){h=new Date,y=h.getTime(),function(e,t){void 0===t&&(t=1),e.physics.world.step(t/1e3,1,3)}(d,(y-b)/10),b=y}),10);var u=function(){d.threeBodies.forEach((function(e,t){e.forEach((function(e,o){d.threeBodies[t][o].body.position.z=d.threeBodies[t][o].physics.position.z}))})),d.scenes.forEach((function(e,t){e.objectData.renderer.render(e.objectData.scene,e.objectData.camera)})),requestAnimationFrame(u)};u()}]);