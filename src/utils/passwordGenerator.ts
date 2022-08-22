//Generador de códigos de seguridad
//configurado para 10 caracteres, 1 símbolo, 3 mayúsculas, 3 minúsculas 3 números

const generarPassword = () => {
  const password: any[] = [];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const symbols = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "_",
    "<",
    ",",
    ">",
    ".",
    "|",
  ];
  const upperCase = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const lowerCase = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  let index = 0;
  while (index < 3) {
    //control para usar 3 may, 3 min y 3 num
    if (index < 1) {
      //control para solo usar 1 símbolo
      password.push(symbols[Math.floor(Math.random() * 14)]);
    }
    password.push(numbers[Math.floor(Math.random() * 10)]);
    password.push(lowerCase[Math.floor(Math.random() * 26)]);
    password.push(upperCase[Math.floor(Math.random() * 26)]);
    index++;
  }
  function shuffleArray() {
    //mezcla el array password
    for (var i = password.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = password[i];
      password[i] = password[j];
      password[j] = temp;
    }
    const stringPass = password.join("");
    return stringPass;
  }
  return shuffleArray();
};

export default generarPassword;
