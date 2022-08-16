import { enviroment } from "../config/enviroment";
import { Book } from "../entity/book.entity";

//Templates de los distintos emails que se pueden enviar

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(enviroment.SENDGRID_API_KEY);

export const sendMailAtRegister = (
  email: string,
  pass: string,
  fullName: string,
  confirmation: string
) => {
  // using Twilio SendGrid's v3 Node.js Library

  const msg = {
    to: `${email}`,
    from: enviroment.SENDGRID_REGISTERED_EMAIL,
    subject: "Biblioteca OnLine -Datos de acceso",
    text: "Datos de acceso",
    html: `<strong><pre>Hola ${fullName},
      
      te registraste en la Biblioteca Online. Recordá que tus datos de ingreso son: 
                                                                                  
        email: ${email} 
        contraseña: ${pass} 
      
        Para validar tus datos haz click en el siguiente link
       <a href=${enviroment.SV_HOST}/src/confirmation?token=${confirmation}&email=${email}><strong>Activar</strong></a>
      
                                    Disfruta del sitio.
                                    
                                    
                                    
    
    Si no fuiste tu, ignora este email o respóndelo para comunicarte con el administrador</pre> </strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email at register sent");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const sendMailAtForgot = (
  email: string,
  pass: string,
  fullName: string
) => {
  const msg = {
    to: `${email}`,
    from: "gpidote@inidep.edu.ar",
    subject: "Biblioteca OnLine -Recuperar contraseña",
    text: "Datos de acceso",
    html: `<strong><pre>Hola ${fullName},
    
      
      te enviamos una contraseña nueva!! Los datos de acceso son:
                                                                                  
        email: ${email} 
        contraseña: ${pass} 
      
      
      
                                    Disfruta del sitio.
                                    
                                    
                                    
                                    
    Si no fuiste tu, ignora este email o respóndelo para comunicarte con el administrador</pre> </strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent at forgot");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const sendMailToAdmin = (books: Book[], borrowedBooks: any) => {
  const msg = {
    to: "gpidote@inidep.edu.ar", //admin email
    from: "gpidote@inidep.edu.ar",
    subject: "Biblioteca OnLine - Weekly Summary",
    text: "Datos de acceso",
    html: `<strong><pre>Hola Mr. Admin,
      
      Resumen semanal de la biblioteca
                                                                                  
        
        Libros prestados:
      ${borrowedBooks.map((element: any) => {
        if (element.book.isBorrowed) {
          return (
            "\nTITULO: " +
            element.book.title +
            "\nPrestado a: " +
            element.book.borrowedTo +
            "\nRetirado el día: " +
            element.book.borrowedAt.toString() +
            "\nSe devuelve el día: " +
            element.returnDate +
            "\nBookID: " +
            element.book.id +
            "\nAutorID: " +
            element.book.author.id +
            "\n--------------------------"
          );
        }
      })}

            <span style="color:red;">Libros Adeudados:
          ${borrowedBooks.map((element: any) => {
            if (element.passedDays > 7) {
              return (
                "\nTITULO: " +
                element.book.title +
                "\nPrestado a: " +
                element.book.borrowedTo +
                "\nRetirado el día: " +
                element.book.borrowedAt.toString() +
                "\nSe devuelve el día: " +
                element.returnDate +
                "\nDias de mora: " +
                Math.abs(7 - element.passedDays) +
                "\nBookID: " +
                element.book.id +
                "\nAutorID: " +
                element.book.author.id +
                "\n--------------------------"
              );
            } else {
              return;
            }
          })}</span>
       
          Libros en la Biblioteca:
        ${books.map((book) => {
          if (!book.isBorrowed) {
            return (
              "\nTITULO: " +
              book.title +
              "\nBookID: " +
              book.id +
              "\nAutorID: " +
              book.author.id +
              "\n--------------------------"
            );
          }
        })}
      
      
                                   Te saluda tu server amigo`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent to admin");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const sendMailForOwedBooks = (book: any) => {
  const msg = {
    to: `${book.book.borrowedTo}`,
    from: "gpidote@inidep.edu.ar",
    subject: "Biblioteca OnLine -Libro Adeudado",
    text: "Libro Adeudado",
    html: `<strong><pre>Hola usuario,
      
      Te enviamos este correo para informarte que debes devolver el libro vencido, 
      a la brevedad. Recuerda que por cada día de mora deben abonarse 50 pesos ja.
        
       Libro en mora: 
       
      ${
        "Título: " +
        book.book.title +
        "\nAutor: " +
        book.book.author.fullName +
        "\nFecha de devolución: " +
        book.returnDate +
        "\nDias de mora: " +
        Math.abs(7 - book.passedDays) //Se puede enviar el costo a pagar
      }  
       
     
      
      
                                    Disfruta del sitio.`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent to delayed user");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const sendMailAtLoanBook = (email: string, book: any) => {
  // using Twilio SendGrid's v3 Node.js Library

  const msg = {
    to: `${email}`,
    from: enviroment.SENDGRID_REGISTERED_EMAIL,
    subject: "Biblioteca OnLine -Se te prestó el libro " + book.title,
    text: "Préstamo",
    html: `<strong><pre>Hola,
      
      Pediste prestado el siguiente libro: ${book.title},
      
      del autor ${book.author.fullName}
                                                                                
        
       
      
        Recordá que tienes 7 días a partir de este momento para devolverlo
       
      
                                    Disfruta del libro.
                                    
                                    
                                    
    
    Si no fuiste tu, responde este email para comunicarte con el administrador</pre> </strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email at loanBook sent");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const sendMailAtGiveBackBook = (email: string, book: any) => {
  // using Twilio SendGrid's v3 Node.js Library

  const msg = {
    to: `${email}`,
    from: enviroment.SENDGRID_REGISTERED_EMAIL,
    subject: "Biblioteca OnLine -Se devolvió el libro " + book.title,
    text: "Devolución",
    html: `<strong><pre>Hola,
      
      Acabas de devolver el siguiente libro: ${book.title},
      
      del autor ${book.author.fullName}
                                                                                
        
       
      
        Espero que lo hayas disfrutado
       
      
                                    Saludos.
                                    </pre> </strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email at GiveBackBook sent");
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
