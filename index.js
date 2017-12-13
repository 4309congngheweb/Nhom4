var express =require ("express");
var app= express();
var upload=require('express-fileupload');
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
app.use(upload());

var server=require("http").Server(app);
var io=require("socket.io")(server);
server.listen(3000);

var MangUser=[];

io.on("connection", function(socket){
	console.log("có người vừa kết nối " + socket.id);


		socket.on("client-send-Username",function(data){
			if(MangUser.indexOf(data)>=0){
				socket.emit("server-send-dki-thatbai");

			}
			else{
				MangUser.push(data);
				socket.Username =data;
				socket.emit("server-send-dki-thanhcong", data);
				io.sockets.emit("server-send-danhsach-Users", MangUser )
			}

		});
		socket.on("logout", function(){
			MangUser.splice(
			MangUser.indexOf(socket.MangUser),1
			);
			socket.broadcast.emit("server-send-danhsach-Users", MangUser);
		});
		socket.on("thanhvien_gui_message", function(data){
        io.sockets.emit("server_gui_message" , {Username : socket.Username , msg:data});
     });

});

app.get("/",function (req , res) {
    res.render("TrangChu");
    res.sendFile(__dirname+'/TrangChu.ejs');

});
app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = __dirname + '/uploads/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
})
