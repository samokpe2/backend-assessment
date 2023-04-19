# Tiiny Host Backend Assessment

This is a skeleton Node.js app running on [Express].

## Instructions

You task for this assessment is to complete the `/upload` api. The code for this is in `/app/aws/upload.js`.

The upload api should take two parameters

1. A zip file
2. An email address

The api should then extract the zip file and return a 200 JSON response 

```javascript
{
    "fileCount": 0, // The number of files in the zip folder
    "largestFile": "", // The size of the largest file
    "email": "" // The email submitted in the request
}
```

For your convenience we have also added an `example.zip` file in the root of this repository.

## How to submit your solution

Simply fork this repo and commit your solution to your forked repo. Then send us the link to your repo.

## Tips

- We rate clean, well-presented code very highly
- Make sure to gracefully handle error scenarios
- You can use whatever libraries you like
