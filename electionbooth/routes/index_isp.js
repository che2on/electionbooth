var request = require('request');
var FormData = require('form-data');
var querystring = require('querystring');
var cheerio = require("cheerio");
var mongo = require('mongodb');
var MONK = require('monk');
var DB = MONK('localhost:27017/bbnl');
var collection = DB.get('loadtest2');
var COOKIE = "";
var DATA = "";
var result = [];

//res.contentType('application/json');
//res.send(JSON.stringify(result));
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};




exports.downloadedfull = function(req, res) {

  var start = +new Date("01 Jan, 13 00:00:00 "+ "UTC+05:30");
  var end   = +new Date("16 Jan, 14 00:00:00 "+ "UTC+05:30");

  var options = {
    //"limit": 30,
    "sort": {"timestamp":1}
}

  collection.find( {timestamp: {"$gte": start, "$lt": end}}, options, function(err,docs) 
  {
      console.log(docs);
      result = [];
      for(var a in docs)
      {
        console.log("wow"+docs[a].timestamp);
         result.push({count:docs[a].Download_MB, date:docs[a].Login_Time });
      }
     
      console.log("pushed");
      res.redirect("/timegraph");
    
  });

};


exports.downloadedlastmonth = function(req, res) {
  var start = +new Date("16 Dec, 13 00:00:00 "+ "UTC+05:30");
  var end   = +new Date("16 Jan, 14 00:00:00 "+ "UTC+05:30");

  var options = {
    //"limit": 30,
    "sort": {"timestamp":1}
  }

  collection.find( {timestamp: {"$gte": start, "$lt": end}}, options, function(err,docs) 
  {
      console.log(docs);
      result = [];
      for(var a in docs)
      {
        console.log("wow"+docs[a].timestamp);
         result.push({count:docs[a].Download_MB, date:docs[a].Login_Time });
      }
     
      console.log("pushed");
      res.redirect("/timegraph")
    
  });
}



exports.disconnections = function(req, res) 
{
  var start = +new Date("16 Sept, 13 00:00:00 "+ "UTC+05:30");
  var end   = +new Date("20 Sept, 13 00:00:00 "+ "UTC+05:30");
 
  var startsec = 0;
  var endsec = 300;



  var options = {
   // "limit": 30,
    "sort": {"timestamp":1}
  }

  collection.find( { timestamp: {"$gte": start, "$lt": end} , session_seconds: {"$gte": startsec, "$lt": endsec}}, options, function(err,docs) 
  {
      console.log(docs);
      result = [];
      var dates = [];
      for(var a in docs)
      {
         console.log("wow"+docs[a].timestamp);
         dates.push(docs[a].Login_Time.substring(0,10));
        // result.push({count:1, date:docs[a].Login_Time });
      }
     
      console.log("pushed");
      res.redirect("/timegraph")

      uniqueCount = ["a","b","c","d","d","e","a","b","c","f","g","h","h","h","e","a"];

      var  count = {}; 

      dates.forEach(function(i) { date = count[i] , count[i]= (count[i]||0)+1;  });
      console.log(count);
      for(var prop in count)
      result.push({date:prop , "count":""+count[prop]})
      console.log(result);
    
  });
}









exports.timegraph = function(req, res) {
  res.render('timegraph', {});
}

exports.bargraph = function(req, res) {
  res.render('bargraph', {});
}

exports.timegraphdata = function(req, res){

 // json = [{"count":11,"date":"07 Jan 2014 13:04"},{"count":16,"date":"07 Jan 2014 13:05"},{"count":14,"date":"07 Jan 2014 13:06"}]
  json = JSON.stringify(result);
  res.send(result);
}

exports.signin = function(req, res){
  res.render('signin', {title: 'Sign in'});
  var l = request.get("http://124.40.244.213/cgi/logout.php", logout);
  var r= request.get("http://124.40.244.213/cgi/login.php" , function initialize(err, response, body)
 {

   var cookie = response.headers["set-cookie"];
   console.log(cookie[0]);
   var tmp = cookie[0].split(";");
   COOKIE = tmp[0];
   console.log(COOKIE);
   
});
 
};

exports.formsubmit = function(req, res){
  console.log(req.body.username);
  console.log(req.body.password);
  var form = new FormData();
  form.append("txtLogin", req.body.username);
  form.append("txtLoginPass", req.body.password);
  form.append("Submit", "Login");

form.getLength(function(err, length){
  if (err) {
    return loginCallback(err);
  }

  var r = request.post("http://124.40.244.213/cgi/login.php", function loginCallback(err, response, body)
  {
  console.log(body);
  res.redirect("/usage");

  //res.redirect("/usage");
  });
  r._form = form;     
  console.log(form);
  r.setHeader('Content-Length', length);
  r.setHeader('Cookie',COOKIE);
  r.setHeader('Content-Type',"multipart/form-data");
  

});

};


exports.usage = function(req, res) {
 console.log()
  var data = querystring.stringify({
      "DayFrom": "01",
      "MonthFrom": "01",
      "YearFrom": "13",
      "DayTo": "17",
      "MonthTo": "01",
      "YearTo": "14",
      "usage":"Check Usage",
      "UsageReport":"1",

    });


  var r= request.get("http://124.40.244.213/cgi/indiusage.php?"+data , function requestCallback(err, response, body)
{
var serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime;

console.log(body);
var $ = cheerio.load(body);
var columncounter=0;
$('td.list_A').each(function(i, element)
{

       if(columncounter==0) serialnumber = $(this).text();
       if(columncounter==1) ipaddress = $(this).text();
       if(columncounter==2) logintime = $(this).text();
       if(columncounter==3) logouttime = $(this).text();
       if(columncounter==4) downloaded = $(this).text();
       if(columncounter==5) uploaded = $(this).text();
       if(columncounter==6) total = $(this).text();
       if(columncounter==7){ sessiontime = $(this).text(); insertStuff(serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime)  }
         columncounter++;
       if(columncounter>7)
       {
        columncounter=0;
       }

      
       
     

       DATA += $(this).text()+"/n";
       console.log($(this).text());


     
    //  var a = $(this).prev();
     // console.log(a.text());
});

var columncounter=0;
$('td.list_B').each(function(i, element)
{

       if(columncounter==0) serialnumber = $(this).text();
       if(columncounter==1) ipaddress = $(this).text();
       if(columncounter==2) logintime = $(this).text();
       if(columncounter==3) logouttime = $(this).text();
       if(columncounter==4) downloaded = $(this).text();
       if(columncounter==5) uploaded = $(this).text();
       if(columncounter==6) total = $(this).text();
       if(columncounter==7){ sessiontime = $(this).text(); insertStuff(serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime)  }
       columncounter++;
       if(columncounter>7)
       {
        columncounter=0;
       }

       DATA += $(this).text()+"\n";
       console.log($(this).text());

       var resultDB = collection.find();

       console.log(resultDB);

//print the data from the result object.
      // resultDB.forEach(function(data)
      // {
      //  console.log(tojson(data));
      // });
     
    //  var a = $(this).prev();
     // console.log(a.text());
});


 res.send(DATA);

// res.redirect("/timegraph");
 //res.render('timegraph', {});

 
});

  r.setHeader('Cookie',COOKIE);
 
  //res.render('index', { title: 'Express' });
};






function logout(err, res, body)
{
  console.log(body);
}



 


function requestCallback(err, res, body)
{
var serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime;

console.log(body);
var $ = cheerio.load(body);
var columncounter=0;
$('td.list_A').each(function(i, element)
{

       if(columncounter==0) serialnumber = $(this).text();
       if(columncounter==1) ipaddress = $(this).text();
       if(columncounter==2) logintime = $(this).text();
       if(columncounter==3) logouttime = $(this).text();
       if(columncounter==4) downloaded = $(this).text();
       if(columncounter==5) uploaded = $(this).text();
       if(columncounter==6) total = $(this).text();
       if(columncounter==7){ sessiontime = $(this).text(); insertStuff(serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime)  }
       columncounter++;
       if(columncounter>7)
       {
        columncounter=0;
       }

       DATA += $(this).text()+"/n";
       console.log($(this).text());


     
    //  var a = $(this).prev();
     // console.log(a.text());
});

var columncounter=0;
$('td.list_B').each(function(i, element)
{

       if(columncounter==0) serialnumber = $(this).text();
       if(columncounter==1) ipaddress = $(this).text();
       if(columncounter==2) logintime = $(this).text();
       if(columncounter==3) logouttime = $(this).text();
       if(columncounter==4) downloaded = $(this).text();
       if(columncounter==5) uploaded = $(this).text();
       if(columncounter==6) total = $(this).text();
       if(columncounter==7){ sessiontime = $(this).text(); insertStuff(serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime)  }
       columncounter++;
       if(columncounter>7)
       {
        columncounter=0;
       }

       DATA += $(this).text()+"/n";
       console.log($(this).text());
     
    //  var a = $(this).prev();
     // console.log(a.text());
});



}


function insertStuff(serialnumber,ipaddress,logintime,logouttime,downloaded,uploaded,total,sessiontime)
{
     var id = collection.insert(
        {
                                              "serialnumber" : serialnumber,
                                              "IP_Address": ipaddress,
                                              "Login_Time" : logintime,
                                              "Logout_Time": logouttime,
                                              "Download_MB" : downloaded,
                                              "Upload_MB" : uploaded ,
                                              "Total_MB": total,
                                              "Session_Time": sessiontime,                         
       }, function (err, docs)
       {
                                        
                                            if(err)
                                            {
                                              console.log("didnt insert");

                                            }
                                            else
                                            {
                                              result.push({count:3, date:docs.Login_Time})
                                             // docs.timestamp = +new Date(docs.Login_Time);
                                              //collection.save(docs);

                                              console.log("success inserting");

                                            }

      });

}