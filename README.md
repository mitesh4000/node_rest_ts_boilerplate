Trust\_To\_Pay Assignment
=========================

Things to consider
-----------------

Dear examiner,

The API response is in a simple format. A successful response will return only data, with no unnecessary information.

- Successful response format:
```json
{
  "data": "some data fetched by user"
}
```

- Failed response format:
```json
{
  "error": "some error in execution"
}
```

Swagger Documentation
--------------------

To access the Swagger documentation, visit the provided base URL:

- Base URL: [BASE_url]:[PORT_NUMBER]/docs
![image](https://github.com/user-attachments/assets/96cd58bc-d439-439a-8aea-4ed6c141dbb6)

Error Handling
--------------

API responses will return a JSON object with an `error` or `data` property.

- `error`: Indicates a failed API request. The value will contain an error message.
- `data`: Indicates a successful API request. The value will contain the requested data.

Contact Information
-------------------

For any questions, concerns, or feedback, please contact [mitesh96625@gmail.com](mailto:mitesh96625@gmail.com).

I am open to constructive criticism and look forward to your feedback.

Thank you for your time and consideration.
