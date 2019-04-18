// Database helper file. This creates an object to assist
// with dyanamo operations. 

var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "Schooldata";

var dbHelper = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();


dbHelper.prototype.getMovies = (userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#userID = :user_id",
            ExpressionAttributeNames: {
                "#userID": "userId"
            },
            ExpressionAttributeValues: {
                ":user_id": userID
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}

module.exports = new dbHelper();