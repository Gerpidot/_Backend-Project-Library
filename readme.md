# Proyecto Biblioteca Online (Challenge)

_@IALAB / @StartCoding / @PUZZLE_

_NODEJS - APOLLO-SERVER-EXPRESS - TYPEORM - POSTGRESQL_

## Resumen

---

### Registro:

- #### Crear usuario.
- El usuario debe confirmar su cuenta mediante un email.
- El usuario puede recuperar su contraseña mediante un email.

---

### Aciones del Usuario:

- #### Podrá consultar, retirar (máximo 3 por usuario) y devolver libros.
- Puede ver el listado de libros completo.
- Consultar un libro por su Id ó su título.
- Consultar libros disponibles.
- Consultar fecha de préstamo y devolución de los libros
- No se podrán retirar libros que hayan sido prestados y viceversa.
- Consultar todos los autores con sus libros.

---

### Acciones del Admin:

- #### Podrá crear, modificar, consultar o eliminar libros y autores (CRUD).

---

### Acciones automáticas del Server:

- #### Control diario de los libros prestados, en caso de libros en mora se envía un email al usuario.
- Control semanal de la biblioteca, genera un resumen del estado de los libros y se envía un email al administrador del server.

---

---

## Schema:

`type Query { getAllBooks: [Book!]! getBookByID(input: BookIdInput!): Book! searchByTitle(input: TitlieInput!): [Book!]! getAllAuthor: [Author!]! getOneAuthor(input: AuthorIdInput!): Author! getAllUsers: [User!]!}`

`type Mutation { createBook(input: BookInput!): Book! updateBookByID(input2: BookUpdateInput!, input: BookIdInput!): Boolean! putTookBookById(input2: TookAndPutBookInput!, input: BookIdInput!): Boolean! deleteBookByID(input: BookIdInput!): Boolean! createAuthor(input: AuthorInput!): Author! updateAuthorByID(input: AuthorUpdateInput!): Author! deleteAuthorByID(input: AuthorIdInput!): Boolean! register(input: UserInput!): User! login(input: LoginInput!): LoginResponse! forgotPassword(input: RecoverPassInput!): LoginResponse! activeUser(input: ActivateInput!): LoginResponse! }`

---

## Estado del Proyecto

---

- Backend completo.
- Frontend incompleto (Es posible realizar el registro completo del usuarios y consultar libros o autores).

---

## Requisitos

---

- NodeJs v16.14.0 / npm 8.3.1
- Clonar repositorio
- API_KEY Sendgrid
- PostgreSQL
- .env
  `PORT=**** / DB_HOST=localhost / DB_PORT=5432 / DB_USERNAME= postgre DB_PASSWORD= yourpass /DB_DATABASE= "Biblioteca" / JWT_SECRET=secret_key / SENDGRID_API_KEY=APi_KEY /`

---

---

# Ejecución:

- Server: src/ npm install.... npm run dev
- Client: src/myapp/ npm install....npm run dev
