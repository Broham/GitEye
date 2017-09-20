var https = require('https')
var async = require('async')

module.exports = function (ctx,cb) { 
  console.log("**********************************************")
  // console.log("GitEye context:",ctx.data.commits)
  // console.log("email:", ctx.data.head_commit.author.email)
  var danger = ['password','pass','pw','pwd','passwd','key','user','username','secret']
  var re = new RegExp(danger.join('|'))
  async.waterfall([
      // make a call to get the commit data (which will include the list of files we want to examine)
      function(callback){
        // console.log("CommitUrl:", getApiPath(ctx.data.head_commit.url))
        var options = {
          host: 'api.github.com',
          path: getApiPath(ctx.data.head_commit.url),
          headers: {
            'User-Agent': 'Broham'
          }
        }
        getData(options, function(commitData){
          // console.log("commit data", commitData)
          callback(null,commitData.files) 
        })
      },
      //for each file, get the file content and look for potentially sensitive information that has been commited
      function(files, callback){
        // console.log("files", files)
        var review = []
        async.each(files, function(file, fileCallback){
          var fileOptions = {
            host: 'api.github.com',
            path: file.contents_url.replace('https://api.github.com', ''),
            headers: {
              'User-Agent': 'Broham'
            }
          }
          // get the JSON that will have the URL for the raw file content
          getData(fileOptions, function(fileData){
            // get the raw file content
            https.get(fileData.download_url, function(contentData){
                contentData.setEncoding('utf-8')
                var contents = ''
                contentData.on('data', function (data) {
                  contents += data
                })
                contentData.on('end', function(){
                  console.log('contents', contents)
                  // check to see if there are any matches for the terms we want to review.
                  matches = contents.match(re)
                  if(matches.length > 0){
                    // console.log("matches", matches)
                    review = review.concat(contents.match(re))
                  }
                  fileCallback()
                })
              })
          })
        }, function(err){
          callback(null, review)
        })

      }
    ], function(err, results){
        if(results.length > 0){
          console.log("For review:", results)
        }
        cb(null, 'GitEye complete!')
        console.log("**********************************************")
  })
}

function getData(options, callback){
  https.get(options, function(res){
    res.setEncoding('utf-8')
    var body = ''
    res.on('data', function (data) {
      body += data
    })

    res.on('end', function(){
      // console.log('body', body)
      var data = JSON.parse(body);
      callback(data)
    })
  })
}

// https://github.com/Broham/TestProject/commit/2c30745c64b035059402f382ae02c89f9e19bac3
// https://api.github.com/repos/Broham/TestProject/commits/2c30745c64b035059402f382ae02c89f9e19bac3
function getApiPath(url){
  var pieces = url.split('/')
  var user = pieces[3]
  var repo = pieces[4]
  var commit = pieces[6]
  // return "https://api.github.com/repos/" + user + "/" + repo + "/commits/" + commit
  return "/repos/" + user + "/" + repo + "/commits/" + commit
}