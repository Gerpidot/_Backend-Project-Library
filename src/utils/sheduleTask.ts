import { assertUnionType } from "graphql";
import { authResolver } from "../resolvers/auth.resolver";
import { bookResolver } from "../resolvers/book.resolver";
import { sendMailForOwedBooks, sendMailToAdmin } from "../utils/sendGridConfig";
import { borrowedDaysNumber, returnDate } from "./moment";
const cron = require("node-cron");

//Manejo de tareas programadas

//59 23 * */1 0 realizar tareas una vez por semana, los domingos a las 23:59
//59 23 */1 * * realizar tareas diarias a las 23:59

//*Se obtienen datos de la base*//

//Se obtienen todos los libros
const _getAllBooks = async () => {
  const callResolver = new bookResolver();
  const allBooks = await callResolver.getAllBooks();
  return allBooks;
};

/*-------------------------------------------*/

//Se llama la funcion para enviar correo al admin y se pasan todos los libros
const adminSummary = async () => {
  const allBooks = await _getAllBooks();
  const borrowedBooks = await booksBorrowedDateInfo();
  sendMailToAdmin(allBooks, borrowedBooks);
};

//2*Control diario, verificacion libros prestados y se devuleve fecha de devolucion
//y dias que lleva prestado

const booksBorrowedDateInfo = async () => {
  const allBooks = await _getAllBooks();
  const control: any = [];

  allBooks.map((book) => {
    if (book.isBorrowed) {
      const borrowedAt = book.borrowedAt;
      const dateNow = new Date().toUTCString();
      const daysNumber = borrowedDaysNumber(borrowedAt, dateNow); //diferencia entre fecha actual y fecha de préstamo
      const parsedDaysNumber = parseInt(daysNumber);
      const returnDateFormat = returnDate(borrowedAt);

      control.push({
        book: book,
        passedDays: parsedDaysNumber,
        returnDate: returnDateFormat,
      });
    }
  });
  return control;
};
//Se envía el mail al usuario si este tiene libros en mora
const sendMailForOwedBooksTask = async () => {
  const control = await booksBorrowedDateInfo();
  control.map((element: any) => {
    if (element.book.isBorrowed) {
      if (element.passedDays > 7) {
        sendMailForOwedBooks(element);
      }
    }
  });
};

//Tareas semanales
export const weeklySummary = cron.schedule("59 23 * */1 0", async () => {
  await adminSummary();
});

//Tareas diarias
export const dailyControl = cron.schedule("59 23 */1 * *", async () => {
  await sendMailForOwedBooksTask();
});


