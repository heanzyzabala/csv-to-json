# csv-to-json

A file processor that converts csv rows to json objects with labeled fields.

Currently labels: `string`,`number`,`phoneNumber` and `emailAddress`

Converts:
```
first_name;last_name;zip,phone1,email
Alford,Pfannerstill,25923,999-560-5151,alford@gmail.com
```
To:
```
{
  "first_name": {
    "type": "string",
    "value": " Alford"
  },
  "last_name": {
    "type": "string",
    "value": "Pfannerstill"
  },
  "zip": {
    "type": "number",
    "value": "25923"
  },
  "phone1": {
    "type": "phoneNumber",
    "value": "999-560-5151"
  },
  "email": {
    "type": "emailAddress",
    "value": "alford@gmail.com"
  }
}
```


## Installation
Clone repository
```bash
git clone https://github.com/heanzyzabala/csv-to-json.git
```

Install dependencies
```bash
npm i
```

## Usage

The csv file will be fetched in s3 so you need to update the `.env.example` to `.env` and set your aws credentials. 
```
AWS_REGION=***
AWS_ACCESS_KEY_ID=***
AWS_SECRET_ACCESS_KEY=***
AWS_S3_BUCKET=***
```

Run locally:
```
npm run dev
```

Send a request:

POST /files/convert

Request:
```
{
  "source": "sample.csv"
}
```
Response:
```
{
  "result": "https://bucket.s3.region.amazonaws.com/path"
  "rows": 1000,
}
```

The request is validated by swagger.

Check the swagger file here: https://github.com/heanzyzabala/csv-to-json/blob/master/src/swagger.yaml


