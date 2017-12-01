const klass     = require('klass');
const AWS       = require('aws-sdk');
const crypto    = require('crypto');
const fs        = require('fs');
const _         = require('underscore');

var config      = {};

var Storage = klass(function(options) {
  if (options.do) {
    _.extend(config, options.do);
  }
  
  if (config.acl == undefined) {
    config.acl = 'public-read';
  }

  if (config.endpoint == undefined) {
    config.endpoint = process.env.DO_ENDPOINT;
  }

  if (config.key == undefined) {
    config.key      = process.env.DO_ACCESS_KEY_ID;
  }

  if (config.secret == undefined) {
    config.secret   = process.env.DO_SECRET_ACCESS_KEY;
  }

  if (config.bucket == undefined) {
    config.bucket   = process.env.DO_BUCKET;
  } 
 

  var EP = new AWS.Endpoint(config.endpoint);

  AWS.config.update({
    accessKeyId: config.key, 
    secretAccessKey: config.secret
  });

  this.do = new AWS.S3( { endpoint: EP, params: { bucket: config.bucket } } )

}).methods({

  host: function() {
    return '://'+config.endpoint + "/"; 
  },

  stream: function(stream, key, next) {
    if (typeof stream == 'string') stream = fs.createReadStream(stream);
    var self = this;
    stream.on('open', function () {
      var params = {
        ACL:    config.acl, 
        Bucket: config.bucket, 
        Key:    key,
        Body:   stream
      };

      self.do.putObject(params, function(err, data){
        if (next) {
          console.log('finished streaming file', key);
          next(err, data);
        }
      });
    });
  },


  generateKey: function(fieldname, filename) {
    
    var now = new Date().getTime().toString();
    var extension = path.extname(filename);
    const hash    = crypto.createHmac('sha256', fieldname+now)
      .update(filename)
      .digest('hex');

    var key       = 'tmp/' + fieldname + "-" + hash + "." + extension;
    return key;
  
  },

  put: function(key, body, next) {
    var self = this;
    var params = {
      ACL:    config.acl, 
      Bucket: config.bucket, 
      Key:    key, 
      Body:   body
    };

    self.do.putObject(params, function(err, data){
      if (next) {
        next(err, data);
      }
    });
  },

  get: function(key, next) {
    var params = {
      Bucket: config.bucket, 
      Key:    key 
    }

    self.do.getObject(params, function(err, data) {
      var data = data.Body.toString('utf-8'); 
      if (next) {
        next(err, data);
      }
    });
  },

  delete: function(key, next) {
    var self = this;
    var params = {
      Bucket: config.bucket, 
      Key:    key 
    }

    self.do.deleteObject(params, function (err, data) {
      if (next) {
        next(err, key);
      }
    });
  },

  move: function(oldkey, key, next) {
    var self       = this;
    var parameters = {
      Bucket:       config.bucket, 
      Key:          key, 
      CopySource:   bucket + '/' + oldkey
    };

    self.do.waitFor('objectExists', {Bucket: config.bucket, Key: oldkey}, function(err, data) {
      self.do.copyObject(parameters, function(err, data){
        console.log('copied', parameters, err, data);
        var params = {
          Bucket:     config.bucket, 
          Key:        oldkey
        };

        var deleteData;
        if (next) {
          next(err, {copy: data, delete: deleteData});
        }   
      });
    });
  }

})

module.exports = Storage;

