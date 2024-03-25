# Nessie API App

Install required packages with `npm install`.
To run locally: `node server.js` or `npm start`
Runs locally on Port 4000.

![](imgs/app.png)

## Get ATMs
### Endpoint Used: GET /atms

Fill out form to create new request to get ATMs.
![](imgs/search_atms.png)

Result will display list of ATMs in given range and how many pages were found in response.
![](imgs/atm_list.png)

## Get Nessie's Customer Profile
### Endpoint Used: GET /customers/\{id\}

Pages displays details about customer "Nessie" from API.
![](imgs/customer.png)

## Add New Account
### Endpoint Used: POST /customers/\{id\}/accounts

Fill out form with details for new account.
![](imgs/add_account.png)

Result shows response from request with information about new account.
![](imgs/account_created.png)

## Add New Bill
### Endpoint Used: POST /accounts/\{id\}/bills

Fill out form with details for new bill to a credit card account.
![](imgs/add_bill.png)

Result shows response from request with information about new bill.
![](imgs/bill_created.png)

## Add New Purchase
### Endpoint Used: POST /accounts/\{id\}/purchase

Fill out form with details for purchase from a credit card account to merchant Apple.
![](imgs/add_purchase.png)

Result shows response from request with information about new purchase.
![](imgs/purchase_added.png)

## Add New Transfer
### Endpoint Used: POST /accounts/\{id\}/transfer

Fill out form with details for new transfer from credit card account to savings account.
![](imgs/add_transfer.png)

Result shows response from request with information about new transfer.
![](imgs/transfer_added.png)

## Get Credit Card Account Information
### Endpoint Used: GET /enterprise/accounts/\{id\}

Pages displays details about credit card account from enterprise endpoint view.
![](imgs/card.png)

## View and Delete Purchases
### Endpoints Used: 
- GET /accounts/\{id\}/purchases
- DELETE /data (type: Purchases)

View list of purchases made. Click button to delete all purchases.
![](imgs/delete_purchases.png)

Result shows confirmation that data has been cleared.
![](imgs/delete.png)