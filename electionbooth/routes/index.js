var request = require('request');
var FormData = require('form-data');
var querystring = require('querystring');
var cheerio = require("cheerio");
var mongo = require('mongodb');
var MONK = require('monk');
var DB = MONK('localhost:27017/eenl');
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


exports.defaultpage = function(req, res){
  res.render('defaultpage', {});
};






exports.signin = function(req, res){
  res.render('signin', {title: 'Sign in'}); 
};

exports.delhi = function(req, res) {
  res.render('delhi', {title: ''})
};


exports.delhiformsubmit = function(req, res) {
  var form = new FormData();
  form.append("ctl00$ContentPlaceHolder1$TextBoxIDCardNo", req.body.epic)
  //form.append("txtLogin", req.body.username); // store mobile number for tracking.
  form.append("ctl00$ContentPlaceHolder1$ButtonSearch", "Search");
  form.append("__EVENTTARGET", "");
  form.append("__EVENTARGUMENT", "");
  form.append("__VIEWSTATE", "/wEPDwULLTEwNTA3NTE4OTcPZBYCZg9kFgICAw9kFgQCBRA8KwANAgAPFgIeC18hRGF0YUJvdW5kZ2QMFCsACAUbMDowLDA6MSwwOjIsMDozLDA6NCwwOjUsMDo2FCsAAhYMHgRUZXh0BTJLbm93IFlvdXIgIEFzc2VtYmx5IGFuZCBQYXJsaWFtZW50YXJ5IENvbnN0aXR1ZW5jeR4LTmF2aWdhdGVVcmwFFX4vU2VhcmNoTG9jYWxpdHkuYXNweB4HRW5hYmxlZGceClNlbGVjdGFibGVnHghEYXRhUGF0aAUgLypbcG9zaXRpb24oKT0xXS8qW3Bvc2l0aW9uKCk9MV0eCURhdGFCb3VuZGdkFCsAAhYMHwEFI0tub3cgWW91ciBCb290aCBMZXZlbCBPZmZpY2VyIChCTE8pHwIFCn4vQkxPLmFzcHgfA2cfBGcfBQUgLypbcG9zaXRpb24oKT0xXS8qW3Bvc2l0aW9uKCk9Ml0fBmdkFCsAAhYMHwEFNENoZWNrIFlvdXIgTmFtZSBpbiB0aGUgVm90ZXJzJyBMaXN0IChFbGVjdG9yYWwgUm9sbCkfAgUYfi9FbGVjdG9yU2VhcmNodGVzdC5hc3B4HwNnHwRnHwUFIC8qW3Bvc2l0aW9uKCk9MV0vKltwb3NpdGlvbigpPTNdHwZnZBQrAAIWDB8BBTFLbm93IHRoZSBTdGF0dXMgb2YgWW91ciBBcHBsaWNhdGlvbiBmb3IgRW5yb2xtZW50HwIFHX4vQ2hlY2tBcHBsaWNhdGlvblN0YXR1cy5hc3B4HwNnHwRnHwUFIC8qW3Bvc2l0aW9uKCk9MV0vKltwb3NpdGlvbigpPTRdHwZnZBQrAAIWDB8BBRJBbGwgRm9ybXMgUmVjZWl2ZWQfAgUWfi9BbGxSZWNlaXZlZEZvcm0uYXNweB8DZx8EZx8FBSAvKltwb3NpdGlvbigpPTFdLypbcG9zaXRpb24oKT01XR8GZ2QUKwACFgwfAQUcTGlzdCBvZiBEZXNpZ25hdGVkIExvY2F0aW9ucx8CBSB+L0tub3dEZXNpZ25hdGVkT2ZmaWNlckluZm8uYXNweB8DZx8EZx8FBSAvKltwb3NpdGlvbigpPTFdLypbcG9zaXRpb24oKT02XR8GZ2QUKwACFgwfAQUkU2VhcmNoIFlvdXIgTmFtZSBJbiBTdW9Nb3RvIERlbGV0aW9uHwIFJn4vU2VhcmNoWW91ck5hbWVJblN1b01vdG9EZWxldGlvbi5hc3B4HwNnHwRnHwUFIC8qW3Bvc2l0aW9uKCk9MV0vKltwb3NpdGlvbigpPTddHwZnZGRkAgsPZBYCAgMPZBYCZg9kFgQCCw8PFgIfAWVkZAIPDzwrAA0BAA8WBB8AZx4LXyFJdGVtQ291bnQCAWQWAmYPZBYEAgEPZBYWAgEPDxYCHwEFAjE1ZGQCAg8PFgIfAQUCMjlkZAIDDw8WAh8BBQM5OTZkZAIEDw8WAh8BBQExZGQCBQ8PFgIfAQWmBDU2OCwgUE9DS0VULSAxLCBKQU5UQSBGTEFUUywgUEFTQ0hJTSBQVVJJICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZAIGDw8WAh8BBTxDSEVUQU4gU0hBUk1BICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZAIHDw8WAh8BBQZGYXRoZXJkZAIIDw8WAh8BBTxSQU0gUFJBU0FEIFNIQVJNQSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZAIJDw8WAh8BBQI1MGRkAgoPDxYCHwEFBE1hbGVkZAILDw8WAh8BBRFBQ0IwMjM4NTM1ICAgICAgIGRkAgIPDxYCHgdWaXNpYmxlaGRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYCBT1jdGwwMCRMb2dpblZpZXdNYWluSGVhZGVyUGFnZSRMb2dpblN0YXR1c01haW5IZWFkZXJQYWdlJGN0bDAxBT1jdGwwMCRMb2dpblZpZXdNYWluSGVhZGVyUGFnZSRMb2dpblN0YXR1c01haW5IZWFkZXJQYWdlJGN0bDAzBS5jdGwwMCRDb250ZW50UGxhY2VIb2xkZXIxJEdyaWRWaWV3U2VhcmNoUmVzdWx0DzwrAAoCA2YIAgFk");
  form.getLength(function(err, length){
  if (err) {
    return loginCallback(err);
  }

  var r = request.post("http://ceodelhi.gov.in/OnlineErms/ElectorSearchIdCard.aspx", function loginCallback(err, response, body)
  {
  console.log("Error is "+err);
  console.log(body);
  parseDelhiData(req, res, body);
  //res.redirect("/usage");

  //res.redirect("/usage");
  });
  r._form = form;     
  console.log(form);
  r.setHeader('Content-Length', length);
  r.setHeader('Content-Type',"multipart/form-data");
  
  });

};

exports.formsubmit = function(req, res){

  var form = new FormData();
  form.append("ctl00$ContentPlaceHolder1$ddlDistrict", req.body.district)
  //form.append("txtLogin", req.body.username); // store mobile number for tracking.
  form.append("ctl00$ContentPlaceHolder1$txtEpic", req.body.epic);
  form.append("__EVENTTARGET", "");
  form.append("__EVENTARGUMENT", "");
  form.append("__VIEWSTATE", "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");
  form.append("ctl00$ContentPlaceHolder1$btnSearch", "Search");
  form.append("__LASTFOCUS", "");

form.getLength(function(err, length){
  if (err) {
    return loginCallback(err);
  }

  var r = request.post("http://ceokarnataka.kar.nic.in/SearchWithEpicNo_New.aspx", function loginCallback(err, response, body)
  {
  console.log(body);
  parseData(req, res, body);
  //res.redirect("/usage");

  //res.redirect("/usage");
  });
  r._form = form;     
  console.log(form);
  r.setHeader('Content-Length', length);
  r.setHeader('Content-Type',"multipart/form-data");
  

});

};


function parseDelhiData(req, res, data)
{

    var keys = [];
    var values = [];

    var $ = cheerio.load(data);
    console.log("Data is "+$('#ctl00_ContentPlaceHolder1_GridViewSearchResult').html());
   //res.render('result', {});
    var partdata = $('#ctl00_ContentPlaceHolder1_GridViewSearchResult').html();
    var $ = cheerio.load(partdata);

    $('th').each(function(i, element)
    {
        keys.push($(this).text());

    });

    $('td').each(function(i, element)
    {
        values.push($(this).text());

    });


    var json = {};
    //json.push

   for(var i=0; i <keys.length; i++)
   {
      console.log(keys[i]);
      console.log(values[i]);
      var key = keys[i];
      var value = values[i];
      var obj = {};
      key = key.replace(/\s+/g, '');
      key = key.replace(/["']/g, "")
      //obj.keys[i]= value;

      json[key] = value;
   }

   json["epic"] = req.body.epic;
   json["mobile"] = req.body.mobile;
   json["user_agent"] = req.headers['user-agent'];
   json["state"] = "Delhi";

   collection.ensureIndex( { "epic": 1 }, { unique: true } );
   //insert only when they return valid values
   if(json.hasOwnProperty("VotersName"))
   {
   collection.insert(json, function(err,doc)
   {


   });
   }

  // json.push("error": "no");
  console.log("json is "+json);
 // res.send(json);
  //res.send( JSON.stringify(json));
  res.render('delhiresult', json);


}


function parseData(req, res, data)
{

  var keys = [];
  var values = [];

  var error = "yes";
  var $ = cheerio.load(data);
  var columncounter=0;
  console.log("Printing   "+ $('#ctl00_ContentPlaceHolder1_GridView1').html());
  var partdata = $('#ctl00_ContentPlaceHolder1_GridView1').html();
  var $ = cheerio.load(partdata);

  $('th').each(function(i, element)
  {
      keys.push($(this).text());

  });

  $('td').each(function(i, element)
  {
      values.push($(this).text());

  });


  var json = {};
  //json.push




 for(var i=0; i <keys.length; i++)
 {
    console.log(keys[i]);
    console.log(values[i]);
    var key = keys[i];
    var value = values[i];
    var obj = {};
    //obj.keys[i]= value;

    json[key] = value;
 }

 json["epic"] = req.body.epic;
 json["mobile"] = req.body.mobile;
 json["user_agent"] = req.headers['user-agent'];
 json["state"] = "Karnataka";

 collection.ensureIndex( { "epic": 1 }, { unique: true } );
 //insert only when they return valid values
 if(json.hasOwnProperty("FirstName"))
 {
 collection.insert(json, function(err,doc)
 {


 });
 }

// json.push("error": "no");
console.log("json is "+json);
//res.send( JSON.stringify(json));
 res.render('result', json);
 //

  
}

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