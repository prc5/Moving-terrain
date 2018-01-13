var scene = new THREE.Scene();
        var rows = 200, cols = 200;
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        
		var renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize( window.innerWidth, window.innerHeight);
		document.body.appendChild( renderer.domElement );

		var geometry = new THREE.PlaneGeometry( 300, 300, rows, cols );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe:true } );
		var mesh = new THREE.Mesh( geometry, material );
        
        // Height map arrays
        var y = [];// Current height map
        var x = [];// Previous height map
        var z = [];// Height differance between height maps
 
        // Time
        var time = 0;

        // Point lights

        // Right close
        var light1 = new THREE.PointLight( 0xffffff, 0.9, 220 );
        light1.position.set( 120, 35, 160 );
        scene.add( light1 );
        // Left close
        var light2 = new THREE.PointLight( 0xffffff, 0.9, 220 );
        light2.position.set( -120, 35, 160 );
        scene.add( light2 );
        // Right middle
        var light3 = new THREE.PointLight( 0xffffff, 0.6, 180 );
        light3.position.set( 120, 65, 30 );
        scene.add( light3 );
        // Left middle
        var light4 = new THREE.PointLight( 0xffffff, 0.6, 180 );
        light4.position.set( -120, 65, 30 );
        scene.add( light4 );
        // Back right
        var light5 = new THREE.PointLight( 0xffffff, 0.5, 200 );
        light5.position.set( 120, 65, -40 );
        scene.add( light5 );
        // Back Left
        var light6 = new THREE.PointLight( 0xffffff, 0.5, 200 );
        light6.position.set( -120, 65, -30 );
        scene.add( light6 );
        

        // Position of plane and camera
        scene.add( mesh );
        
		camera.position.z = 380;
        camera.position.y += 0;
        
        mesh.rotation.x += 1.8;
        mesh.rotation.y += -3.1416
        
        mesh.position.y = -20; 
        // Terrain
        var heightMap = [];
    
        function map_range(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        }

        var inc = 0.008;
        var zoff = 0;
        var yoff = 0;
        var iteration = 0;

        function generate(){
            var index = 0;
            for(var g = 0; g < Math.sqrt(geometry.vertices.length); g++){
                var xoff = 0;  
                for(var f = 0; f < Math.sqrt(geometry.vertices.length); f++){
                    geometry.vertices[index].z = map_range(noise(xoff,yoff,zoff),0,1,-60,60);
                    xoff+=inc;
                    index +=1; 
                }   
                yoff+=inc;
                zoff+=inc/4;
            }  
            geometry.dynamic = true;
            geometry.verticesNeedUpdate = true;        
        }        

        // Render      
        function animate(){
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
            mesh.rotation.z += 0.001;
            generate();
            
            iteration += 0.003;
            
            zoff = iteration;
            yoff = iteration;
            
        };        
        animate();   
