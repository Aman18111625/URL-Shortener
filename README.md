# URL-Shortener

1. Problem Statement : 

Design a URL Shortener service which take a valid URL and returned a shortened URL and redirected to the user to previously provided URL along with tracking of visits/click on the URL.


2. Routes : 

a. POST /URL --> take a valid URL & return a shortened URL in this format: www.url-shortener-aman.com/random-id

b. GET /URL/:id --> redirect the user to original URL

c. GET /URL/analytics/:id --> return the number of clicks on the shortened URL

