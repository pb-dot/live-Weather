require("dotenv").config();
const e = require("express");
const bp = require("body-parser");
const https =require("https");
const app=e();
app.use(bp.urlencoded({extended:true}));
app.listen(3000,function(){
    console.log("server started at port 3000");
})
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.post("/",function(req,res){
    
    const userCITYinput=req.body.cityID
    const url = "https://api.weatherbit.io/v2.0/current?city="+userCITYinput+"&key="+process.env.API_KEY+"&units=M";
    https.get(url,function(response){
        console.log("STATUS CODE "+response.statusCode);
       var fulljason ='';// const chunks=[];
        response.on("data",function(data){
            fulljason+=data;
        })
        response.on("end",function()
        {
       // const data = Buffer.concat(chunks);
           const obj = JSON.parse(fulljason);           
           const city=obj.data[0].city_name;
           const temp = obj.data[0].temp;
           const weather=obj.data[0].weather.description;
           const imgurl=" https://www.weatherbit.io/static/img/icons/"+obj.data[0].weather.icon+".png";
            res.write("<h1>"+city+" at longitude,latitude:"+obj.data[0].lon+" , "+obj.data[0].lat+"</h1>");
            res.write("<h1>temerature in celcius : "+temp+"</h1>");
            res.write("<h1>weather description : "+weather+"</h1>")
            res.write("<img src="+imgurl+">");
            res.send();
        })
    })
})
