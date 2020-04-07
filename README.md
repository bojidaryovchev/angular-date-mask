# ngdatemask (Angular Date Mask)

ngdatemask - an input date mask directive to control input of dates

it supports dd, MM, yyyy as formats

it makes sure the day is between 1 and 31, the month between 1 and 12 and the year larger than 1895

it wont allow you to enter invalid date/month/year

it does not autofix dates, you have to handle that yourself (e.g. if one enters 31/02/2020 it wont change it)

NOTE: in order to get noticed when the mask is valid and get the value you can bind to the (change) event - it will be triggered when the mask becomes valid (the definition of valid in our case is for all the formats to have reached their lengths)
