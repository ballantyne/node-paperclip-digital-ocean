node-paperclip-digital-ocean
=========

This is an npm module that allows node-paperclip to upload files to digital-ocean.


To install 

```bash
npm install node-paperclip-digital-ocean --save
```

Here is an example of a model that uses the mongoose plugin.

```javascript
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const Paperclip    = require('node-paperclip');

const ProfileImage = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  username: String
});

ProfileImage.plugin(Paperclip.plugins.mongoose, {
  profile_image: {
    avatar: { 
      before_save: [
      
      ],
      styles: [
        { original: true },
        { tiny:     { width: 50,  height: 50,  modifier: '#' } },
        { thumb:    { width: 100, height: 100, modifier: '#' } },
        { profile:  { width: 200, height: 200, modifier: '#' } }
      ],
      prefix:      '{{plural}}/{{document.username}}',
      name_format: '{{style}}.{{extension}}',
      storage: 'digital-ocean'  
      
      // You can use env variables (DO_ENDPOINT, DO_BUCKET, DO_ACCESS_KEY_ID, DO_SECRET_ACCESS_KEY) or pass these options directly and it should work ok.
      // do: {bucket: '', endpoint: '', key: '', secret: ''}
    
    }
  }
})

module.exports     = mongoose.model('ProfileImage', ProfileImage);
```



Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your fix/feature has a high chance of being included, please read the following guidelines:

1. Post a [pull request](https://github.com/ballantyne/node-paperclip-digital-ocean/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for paperclip, please open a
   [GitHub issue](https://github.com/ballantyne/node-paperclip-digital-ocean/issues/new).


And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/node-paperclip-digital-ocean/graphs/contributors)!

License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright 
-------
© 2017 Scott Ballantyne. See LICENSE for details.

