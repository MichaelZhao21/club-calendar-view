# Events Database

## Info Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    name: "[The name of the event]",
    club: "[The club(s) associated with the event]",
    start: "[The starting datetime of the event in UTC millis]",
    end: "[The ending datetime of the event in UTC millis]"
}
```

### Properties

- _id
- objId
- name
- club
- start
- end

## Data Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    links: [
        "[List of strings as links related to the event]",
        // etc...
    ],
    description: "[The description for the event]",
}
```

### Properties

- _id
- objId
- links
- description
- editedBy

## Calendar Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID for event]",
    eventId: "[Google calendar generated event ID]",
}
```

### Properties

- _id
- objId
- eventId
