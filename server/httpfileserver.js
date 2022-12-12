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
             case "game.js":
                path = "/../UI/game.js";
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
         const types = ["js","html","css","jpg"]
         const type = {
            "js":"application/javascript",
            "html":"text/html",
            "css":"text/css",
            "jpg":"image/jpeg"
         }
        let ctype = ""
        types.forEach((t)=>{
            if(path.pathname.endsWith(t))ctype = type[t];
        })
         const response = new Response(file.readable,{
            status:200,
            headers:{
                "content-type":ctype+"; charset=utf-8"
            }
         })
         await requestEvent.respondWith(response);
     }catch{
        try{
            await requestEvent.respondWith(new Response("404 Not Found",{status:404}));
        }catch{
            void undefined //couldn't answer because something already answered
        }
     }
}

export default serveHttpFileServer;