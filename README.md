# 🍔 food-expenditure-dashboard
A minimal web app dashboard to track my personal expenditures on online food ordering via Swiggy and Zomato.

Since there is no official SDK support available for either of these apps, currently making use of the API being consumed via their browser version of apps and depending on cookies for authentication. 


### Local setup

```sh
        $ git clone https://github.com/tamdilip/food-expenditure-dashboard.git
        $ cd food-expenditure-dashboard
        $ npm start
```

#### Pre-requisite
* For authentication, update the respective apps cookies in app config `⚙️` - 
    
    > Navigation:: Swiggy -> Profile -> Orders -> 'cookie' from request header of API - https://www.swiggy.com/dapi/order/all?order_id=
    
    > Navigation:: Zomato -> Profile -> Order history -> Scroll & Paginate to 2nd page -> 'cookie' from request header of API - https://www.zomato.com/webroutes/user/orders?page=


### Dashboard
![Image of dashboard](https://raw.githubusercontent.com/tamdilip/food-expenditure-dashboard/main/docs/dashboard.png)

**Happy coding :) !!**
