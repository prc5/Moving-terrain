var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        
		var renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize( window.innerWidth-20, window.innerHeight-20);
		document.body.appendChild( renderer.domElement );

		var geometry = new THREE.PlaneGeometry( 800, 250, 100, 100 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe:false } );
		var mesh = new THREE.Mesh( geometry, material );
        
        // Height map arrays
        var y = [];// Current height map
        var x = [];// Previous height map
        var z = [];// Height differance between height maps
        
        generateTerrain();
        
        
        // Generate terrain function 
        function generateTerrain(){
                
            var x = 101;
            y = [];
            var max = 30;
            var min = 0;
            var add = 5;
         
            y[0] = Math.random()*10 +7;           
             
            
            // First row x
             for (i=1; i<x; i++){
                var rand = Math.random()*3;
                var height = Math.random()*add;
                if (y[i-1] < max && rand < 1.3) {
                    y[i] = y[i-1] + height;
                }
                else if (y[i-1] > min && rand < 2.6 && rand > 1.3){
                    y[i] = y[i-1] - height;
                }
                else {
                    y[i] = y[i-1]; 
                }
             }

            // First row y
             for (i=x; i<geometry.vertices.length; i+=x){
                var rand = Math.random()*3;
                var height = Math.random()*add;
                if (y[i-x] < 20 && rand < 1.3) {
                    y[i] = y[i-x] + height;
                }
                else if (y[i-x] > min && rand < 2.6 && rand > 1.3){
                    y[i] = y[i-x] - height;
                }
                else {
                    y[i] = y[i-x]; 
                }
             }     


            // Fill height-map
             for (i=1; i<geometry.vertices.length; i++){
                 if(typeof y[i] == "undefined") {
                    var rand = Math.random()*3;
                    var height = Math.random()*add;

                    var diff = ((y[i-x] + y[i-102] + y[i-100] + y[i-1])/4);

                    if (y[i-1] < max && y[i-x] < max && rand < 1.3) {
                        y[i] = diff + height;
                    }
                    else if (y[i-1] > min && y[i-x] > min && rand < 2.6 && rand > 1.3){
                        y[i] = diff - height;
                    }
                    else {
                        y[i] = diff; 
                    }                 
                }
             }
            
            // Repair issues
             for (i=1; i<geometry.vertices.length; i++){
                if((y[i]-y[i-1] > 0.8 && y[i]-y[i+1] > 0.8) || (y[i]-y[i-1] < 0.8 && y[i]-y[i+1] < 0.8)) {
                    y[i] = (y[i-1] + y[i+1])/2;                               
                }
             }
            
        }
        // Add height map values to plane vertices
        function setGeo(){
            for (var i = 0; i < geometry.vertices.length; i++) {
                geometry.vertices[i].z = y[i];
            }      
        }
        
        // Point lights

        // Right close
        var light1 = new THREE.PointLight( 0xffffff, 0.8, 180 );
        light1.position.set( 60, 15, 75 );
        scene.add( light1 );
        // Left close
        var light2 = new THREE.PointLight( 0xffffff, 0.4, 180 );
        light2.position.set( -60, 15, 55 );
        scene.add( light2 );
        // Right middle
        var light3 = new THREE.PointLight( 0xffffff, 0.2, 180 );
        light3.position.set( 20, 5, 0 );
        scene.add( light3 );
        // Left middle
         var light4 = new THREE.PointLight( 0xffffff, 0.3, 180 );
        light4.position.set( -60, 5, -20 );
        scene.add( light4 );
        // Back right
        var light5 = new THREE.PointLight( 0xffffff, 0.6, 280 );
        light5.position.set( 200, 20, 15 );
        scene.add( light5 );
        // Back Left
        var light6 = new THREE.PointLight( 0xffffff, 0.6, 280 );
        light6.position.set( -200, 20, 15 );
        scene.add( light6 );



        // Position of plane and camera
        scene.add( mesh );
        
		camera.position.z = 140;
        camera.position.y += 10;
        
        mesh.rotation.x += 1.8;
        mesh.rotation.y += -3.1416
        
        mesh.position.y = -20; 
        
        // Generate first terrain
        generateTerrain();
        setGeo();
        
        // Terrain change geometry function
        function movingTerrain(){
                    
            // Speed of transforming        
            var count = 300;
            
            
            // Change height
            for(i = 0; i < geometry.vertices.length; i++){
                
                var diff = (y[i] - geometry.vertices[i].z)/count;
                
                if(geometry.vertices[i].z != y[i]) {
                    geometry.vertices[i].z += diff;                    
                    
                    if(geometry.vertices[i].z < -10 || geometry.vertices[i].z > 60) {
                        backToShape();  
                    }
                    else if ((y[i] - geometry.vertices[i].z) < 0.001 && (y[i] - geometry.vertices[i].z) > -0.001){
                        geometry.vertices[i].z += y[i] - geometry.vertices[i].z;
                    }
                }                        
                else {
                    x = y;
                    generateTerrain();
                }
            }
                       
            geometry.dynamic = true;
            geometry.verticesNeedUpdate = true;
        }
        
        function backToShape(){
            generateTerrain();
            x = y;
            for(i = 0; i < geometry.vertices.length; i++){
                y[i] = geometry.vertices[i].z;               
            }
        }     

        
        // Render        
        function animate(){
            movingTerrain();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };        
        
        animate();       