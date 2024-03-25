# Nessie API App

Install required packages with `npm install`.
To run locally: `node server.js` or `npm start`
Runs locally on Port 4000.

![App](imgs/app.png)

## Get ATMs
### Endpoint Used: GET /atms

Fill out form to create new request to get ATMs.
![Search ATMS](imgs/search_atms.png)

Result will display list of ATMs in given range and how many pages were found in response.
![ATM List](imgs/atm_list.png)

## Get Nessie's Customer Profile
### Endpoint Used: GET /customers/\{id\}

Pages displays details about customer "Nessie" from API.
![Customer](imgs/customer.png)

## Add New Account
### Endpoint Used: POST /customers/\{id\}/accounts

Fill out form with details for new account.
![Add Account](imgs/add_account.png)

Result shows response from request with information about new account.
![Created Account](imgs/account_created.png)

## Add New Bill
### Endpoint Used: POST /accounts/\{id\}/bills

Fill out form with details for new bill to a credit card account.
![Add Bill](imgs/add_bill.png)

Result shows response from request with information about new bill.
![Created Bill](imgs/bill_created.png)

## Add New Purchase
### Endpoint Used: POST /accounts/\{id\}/purchase

Fill out form with details for purchase from a credit card account to merchant Apple.
![Add Purchase](imgs/add_purchase.png)

Result shows response from request with information about new purchase.
![Created Purchase](imgs/purchase_added.png)

## Add New Transfer
### Endpoint Used: POST /accounts/\{id\}/transfer

Fill out form with details for new transfer from credit card account to savings account.
![Add Transfer](imgs/add_transfer.png)

Result shows response from request with information about new transfer.
![Created Transfer](imgs/transfer_added.png)

## Get Credit Card Account Information
### Endpoint Used: GET /enterprise/accounts/\{id\}

Pages displays details about credit card account from enterprise endpoint view.
![Card Account](imgs/card.png)

## View and Delete Purchases
### Endpoints Used: 
- GET /accounts/\{id\}/purchases
- DELETE /data (type: Purchases)

View list of purchases made. Click button to delete all purchases.
![Delete Purchases](imgs/delete_purchases.png)

Result shows confirmation that data has been cleared.
![Delete Confirmation](imgs/delete.png)