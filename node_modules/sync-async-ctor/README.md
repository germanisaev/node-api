# sync-async-ctor

A base class that serves to make an otherwise asynchronous constructor into a seemingly synchronous one.

##  Usage

```javascript
const InitBase = require('sync-async-ctor');

class Database extends InitBase {
    constructor() {
        // createConnection will be initiliazed by the base class
        super(createConnection);
    }

    query(queryString, cb) {
        // calling init in derived methods handles queuing and ensures the asynchronous task has completed before continuing
        this.init(() => {
            this.initBase.query(queryString, cb);
        });
    }
}
```
