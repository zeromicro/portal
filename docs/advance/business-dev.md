# A Business Scenerio

## Download the demo project

If you come from the [Quick Start](../quick-start/quick-start) chapter, you should be familiar with the structure of the source code.

[Click Here](../resource/book.zip) to download the demo project

## Demonstration project description

### A demo scenerio

The programmer Xiao Ming needs to borrow a copy of a book entitled "Journey to the West". When there is no online library management system, he goes to the front desk of the library to consult with library staff every day.

* Xiao Ming: Hello, do you still have the book "Journey to the West" today?
* Staff: No more, let's check again tomorrow.

One day later, Xiao Ming came to the library again and asked:

* Xiao Ming: Hello, do you still have the book "Journey to the West" today?
* Staff: No, you can check again in two days.

After many times in this way, Xiao Ming was also in vain and wasted a lot of time on the way back and forth, so he finally couldn't stand the backward library management system.
He decided to build a book review system by himself.

### Expected achievement

* User login:
  Rely on existing student system data to log in
* Book search:
  Search for books based on book keywords and query the remaining number of books.

### System analysis

#### Service design

* user
  * api: provides user login protocol
  * rpc: for search service to access user data
* search
  * api: provide book query agreement

:::tip

Although this tiny book borrowing query system is small, it does not fit the business scenario in practice, but only the above two functions have already met our demonstration of the go-zero api/rpc scenario.
In order to satisfy the richer go-zero function demonstration in the future, business insertion, that is, related function descriptions, will be carried out in the document. Here only one scene is used for introduction.

:::

:::note

Please create the sql statement in the user into the db by yourself, see [prepare](../prepare/prepare) for more preparation work

Add some preset user data to the database for later use. For the sake of space, the demonstration project does not demonstrate the operation of inserting data in detail.

:::

# Reference preset data

```sql
INSERT INTO `user` (number,name,password,gender)values ('666','xiaoming','123456','male');
```
