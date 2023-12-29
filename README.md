# student-insight-server

this bankend server is created as Coding Ninjas Full Stack Skill Test

## Installation

> clone git repository and install dependancies
> 
> ```bash
> git clone https://github.com/akashpadampalle/student-insight-server.git
> cd student-insight-server
> npm install
> ```

> add environment variables
> 
> 1. create .env file in root folder of project
> 2. add these variables
>    * PORT
>    * DB_USER
>    * DB_PASSWORD
>    * ACCESS_TOKEN_SECRET
>    * REFRESH_TOKEN_SECRET
>    * BCRYPT_SALT_ROUNDS

> change frontend url in cors `src -> index.ts`

## Usage

> start server
> 
> ```bash
> npm run dev
> ```

now you can send request to `http://localhost:${PORT}`

### Routes or API endpoints

> #### student
> 
> 1. `GET /student` : get all students
> 2. `GET /student/:id` : get student by id
> 3. `POST /student` : create a student
> 4. `PATCH /student` : update student
> 5. `DELETE /student/:id` : delete student by id

> #### batch
> 
> 1. `GET /batch` : get all batches
> 2. `GET /batch/:id` : get batch by id
> 3. `POST /batch` : create a batch
> 4. `PATCH /batch` : update batch
> 5. `DELETE /batch/:id` : delete batch by id

> #### interview
> 
> 1. `GET /interview` : get all interviews
> 2. `GET /interview/:id` : get interview by id
> 3. `POST /interview` : create a interview
> 4. `PATCH /interview` : update interview
> 5. `DELETE /interview/:id` : delete interview by id

> #### result
> 
> 1. `GET /result` : get all results
> 2. `GET /result/:id` : get result by id
> 3. `POST /result` : create a result
> 4. `PATCH /result` : update result
> 5. `DELETE /result/:id` : delete result by id
> 6. `GET /result/csv` : gets result in csv file

> #### User [ only accesseble by admin ]
> 
> 1. `GET /user` : get all users
> 2. `POST /user` : create a user
> 3. `DELETE /user/:id` : delete user by id

> #### other routes
> 
> 1. `POST /login` : get json accessToken and refreshToken
> 2. `GET /logout` : delete refreshToken from headers
> 3. `DELETE /refresh` : get new accessToken using refresh token

