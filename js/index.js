// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const refresh = document.querySelector('.refresh_btn'); // Кнопка обновить траницу

refresh.addEventListener('click', () => {
  window.location.reload();
});


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22},
  {"kind": "Фейхойя", "color": "красный", "weight": 11},
  {"kind": "Апельсин", "color": "желто-оранжевый", "weight": 37},
  {"kind": "Банан", "color": "желтый", "weight": 17},
  {"kind": "Яблоко", "color": "зеленый", "weight": 44},
  {"kind": "Персик", "color": "оранжевый", "weight": 42}
]`;

const classArray = [{ // массив цветов
  "fruit_violet": "фиолетовый",
  "fruit_green": "зеленый",
  "fruit_carmazin": "розово-красный",
  "fruit_yellow": "желтый",
  "fruit_lightbrown": "светло-коричневый",
  "fruit_red": "красный",
  "fruit_yellow-red": "желто-оранжевый",
  "fruit_lightgreen": "светло-зеленый",
  "fruit_orange": "оранжевый"
}];

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/
//функция поиска ключа по значению (нужна для заливки соответсвующим цветом рамку элемента)
Object.prototype.getKeyByValue = function (value, objs) {
    // защита от циклических ссылок
    if (!objs)
      objs = [];
    for (var prop in this) {
      if (this.hasOwnProperty(prop)) {
        if (this[prop] === value) {
          return prop;
        } else if (typeof this[prop] === "object" && objs.indexOf(this[prop]) == -1) {
          objs.push(this[prop]);
          var res = this[prop].getKeyByValue(value, objs);
          if (res)
            return res;
        }
      }
    }
  }
// отрисовка карточек
const display = () => {

  while (fruitsList.firstChild) fruitsList.removeChild(fruitsList.firstChild);// пока в массиве присутствуют дети, удаляем дочерние элементы

  for (let i = 0; i < fruits.length; i++) { // цикл отрисовки карточек
    const valArr = fruits[i].color;
    let li = document.createElement('li');
    li.className = 'fruit__item ' + classArray.getKeyByValue(valArr); // присваиваем элементу списка li Класс + цвет карточки
    // li_1.innerHTML = 'Первый элемент';
    fruitsList.appendChild(li);
    let div = document.createElement('div');
    div.className = 'fruit__info'; // блок с параметрами фрукта
    li.appendChild(div);
    let div_1 = document.createElement('div');
    let index = 'index: ' + i; // индекс фрукта
    div_1.appendChild(document.createTextNode(index));
    div.appendChild(div_1);
    let div_2 = document.createElement('div');
    div_2.appendChild(document.createTextNode('kind: ' + fruits[i].kind)); // Название фрукта 
    div.appendChild(div_2);
    let div_3 = document.createElement('div');
    div_3.appendChild(document.createTextNode('color: ' + fruits[i].color)); // Цвет фрукта
    div.appendChild(div_3);
    let div_4 = document.createElement('div');
    div_4.appendChild(document.createTextNode('weight: ' + fruits[i].weight)); // Масса фрукта
    div.appendChild(div_4);
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// перемешивание массива
fruitsJSON = JSON.stringify(fruits);

const shuffleFruits = () => {
  let result = []; // сюда запишем перемешанный массив
  while (fruits.length > 0) { // условие, пока длина массива > 0 будет выполняться цикл
    let rdmFruit = getRandomInt(0, fruits.length - 1); //находим случайный элемент массива fruits
    let el = fruits.splice(rdmFruit, 1)[0]; // вырезаем случайный элемент из массива методом splice
    result.push(el); // добавляем в новый массив найденный и вырезанный элемент методом push
  }
  let resultJSON = JSON.stringify(result);
  if (fruitsJSON === resultJSON) { // сравниваем начальный массив с перемешанным, если элементы
    alert('Порядок элементов не изменился, премешайте еще раз!'); // массива в том же порядке, выводим в АЛЕРТ сообщение
  }
  fruits = result; // Присваиваем значение вновь сформированного массива переменной fruits
};

shuffleButton.addEventListener('click', () => { // событие после нажатия кнопки shuffleButton
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let minWeight = document.querySelector('#minWeight').value; // input с весом мин
  let maxWeight = document.querySelector('#maxWeight').value; // input с весом макс
  let result = []; // переменная для отфильтрованного массива
  if ((minWeight === '') || (maxWeight === '')) { // Условия проверки заполненности значений массы
    alert('Одно или несколько полей незаполнены!');
  } else {
  result = fruits.filter((item) => { // фильтруем массив по массе, введенной пользователем (фильтрация по значению элемента массива)
    if ((item.weight >= minWeight) && (item.weight <= maxWeight)) { // условие фильтрации (мин и макс вес)
      return true;
    } else {
      return false;
    }
  });
  fruits = result;
}
}
filterButton.addEventListener('click', () => { // назначaем событие при клике на кнопку
  filterFruits(); // фильтрация массива
  display(); //  отрисовка карточек
});
/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  if (a.color === b.color) {
    return 0;
  }
  return a.color < b.color ? -1 : 1;
};
//Функция обмена элементов
function swap(fruits, firstIndex, secondIndex) { // в качестве аргументов принимается массив, и 2 индекса его ключей
  const temp = fruits[firstIndex];
  fruits[firstIndex] = fruits[secondIndex];
  fruits[secondIndex] = temp;
};
//функция разделитель
function partition(fruits, left, right) {
  var pivot = fruits[Math.floor((right + left) / 2)],
    i = left,
    j = right;
  while (i <= j) {
    while (fruits[i] < pivot) {
      i++;
    }
    while (fruits[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(fruits, i, j);
      i++;
      j--;
    }
  }
  return i;
};
//Функция с алгоритмом быстрой сортировки
function quickSort(fruits, left, right) {
  var index;
  if (parseInt(fruits.length) > 1) {
    left = typeof left != "number" ? 0 : left;
    right = typeof right != "number" ? fruits.length - 1 : right;
    index = partition(fruits, left, right);
    if (left < index - 1) {
      quickSort(fruits, left, index - 1);
    }
    if (index < right) {
      quickSort(fruits, index, right);
    }
  }
  return fruits;

};
const sortAPI = {
  bubbleSort(fruits, comparation = comparationColor) {
    // TODO: допишите функцию сортировки пузырьком
    const n = fruits.length;
    for (let i = 0; i < n - 1; i++) {
      // внутренняя итерация для перестановки элемента в конец массива
      for (let j = 0; j < n - 1 - i; j++) {
        // сравниваем элементы
        if (comparation(fruits[j], fruits[j + 1]) === 1) {
          // делаем обмен элементов
          let temp = fruits[j + 1];
          fruits[j + 1] = fruits[j];
          fruits[j] = temp;
        }
      }
    }

  },

  // выполняет сортировку и производит замер времени
  startSort(sort, fruits, comparation) {
    const start = new Date().getTime();
    sort(fruits, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  if (sortKind === 'bubbleSort') {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    console.log(sortKind);
    display();
    // TODO: вывести в sortTimeLabel значение sortTime
    sortTimeLabel.textContent = sortTime;
  } else {
    sortTimeLabel.textContent = 'sorting...';
    quickSort(fruits, 0, fruits.length - 1);
    sortTimeLabel.textContent = sortTime;
    console.log(sortKind);
    display();
  }
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if ((kindInput.value === '') || (weightInput.value === '') || (colorInput.value === '')) {
    alert('Не заполнено одно из полей')
  } else {
    fruits.push({
      "kind": kindInput.value,
      "color": colorInput.value,
      "weight": weightInput.value
    })
    display();
  }
});
