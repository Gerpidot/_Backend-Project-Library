import moment from "moment";
//Calcula la cantidad de días desde que se prestó un libro a partir de dos fechas
export const borrowedDaysNumber = (start: string, end: string) => {
  const borrowedAt = moment(start);
  const dailyControl = moment(end);
  const passedDays = dailyControl.diff(borrowedAt);

  // ejecucion
  const result = moment.utc(passedDays).format("DD");
  return result;
};

//Calcula la fecha de devolución del libro
export const returnDate = (borrowedAt: string) => {
  const limitDate = moment(borrowedAt);

  return limitDate.add(7, "days").format("DD/MM/YYYY HH:mm");
};
