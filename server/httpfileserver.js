async function serveHttpFileServer(path,requestEvent){
     //HTTP File Server   
     let file;
     try{
         switch(path){
             case "draw.js":
                 path = "/../UI/draw.js"
             break;
             case "script.js":
                 path = "/../UI/script.js";
             break;
             case "style.css":
                 path = "/../UI/style.css";
             break;
             case "background.jpg":
                 path ="/../UI/background.jpg"
             break;
             case "":
             default:
                 path = "/../UI/index.html";
             break;
         }
         path = new URL(import.meta.url+"/.."+path);
         file = await Deno.open(path,{read:true})
         await requestEvent.respondWith(new Response(file.readable));
     }catch{
        try{
            await requestEvent.respondWith(new Response("404 Not Found",{status:404}));
        }catch{
            void undefined //couldn't answer because something already answered
        }
     }
}

export default serveHttpFileServer;