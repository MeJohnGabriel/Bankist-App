'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (account) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  account.movements.forEach(function (curMov, i) {
    const operationType = curMov > 0 ? 'deposit' : 'withdrawal';

    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${operationType}">${
      i + 1
    } ${operationType}</div>
          <div class="movements__value">${curMov} R$</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  // making total of money dynamically
  account.balance = account.movements.reduce(
    (acc, currentMovement) => acc + currentMovement,
    0
  );
  // account.balance = balance;

  labelBalance.textContent = `${account.balance} BRL`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((account, curMov) => account + curMov, 0);
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((account, curMov) => account + curMov, 0);

  //interest is paid in each deposit
  const interestRate = account.movements
    .filter(curMov => curMov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    //Only interest above or equal 1
    .filter((interest, i, arr) => {
      // console.log(arr);
      return interest >= 1;
    })
    .reduce((account, curInterest) => account + curInterest);

  // // Other to calc interesRate
  // const inteRT = (incomes * 1.2) / 100;
  // console.log(`One way : ${inteRT}`);

  labelSumIn.textContent = `${incomes} R$`;
  labelSumOut.textContent = `${Math.abs(outcomes)} R$`;
  labelSumInterest.textContent = `${account.interestRate} BRL`;
};

// CREATING USERNAMES(e.g: Jonas Schem = jg...)
const createUsernames = function (accountsArr) {
  accountsArr.forEach(function (currentAcc) {
    currentAcc.username = currentAcc.owner
      .toLowerCase()
      .split(' ')
      .map(curNam => curNam[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

// UPTADEUI - call: displayMovements ,calcDisplayBalance, calcDisplaySummary
const updateUI = function (account) {
  // Display movements
  displayMovements(currentAccount);
  // Display balance
  calcDisplayBalance(currentAccount);
  // Display summary
  calcDisplaySummary(currentAccount);
};

// currentAccount , Will change as we log in js 1111 will show only its info.
let currentAccount;
//LOGIN function, data is being collected dynamically
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    // Emptying input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSACTIONS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    curAcc => curAcc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }

  // Clearing out inputs
  inputTransferAmount.value = inputTransferTo.value = '';
});

// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const incomes = currentAccount.movements.filter(mov => mov > 0);
  const LoanAmount = Number(inputLoanAmount.value);
  const loanIsAllowed = incomes.some(
    anyDepo => anyDepo >= (LoanAmount * 10) / 100
  );
  // HOW JONAS DID IT : if (amount > 0 && currentAccount.movements.some(mov mov >= amount * 0.1))
  if (LoanAmount > 0 && loanIsAllowed === true) {
    currentAccount.movements.push(LoanAmount);
    updateUI(currentAccount);
    console.log(`A loan of ${LoanAmount} was (${loanIsAllowed})`);
  }
  inputLoanAmount.value = '';
});

// DELETE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // check credentials
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    // Removing account
    accounts.splice(index, 1);

    // Clearing UI
    containerApp.style.opacity = 0;

    // Clearing inputs
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
//////////
// ///////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*



const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, 2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE

// console.log(arr.splice(2));
// arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join('-'));

// AT 
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//Getting last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
console.log('jonas'.at(-1));


//FOR EACH LOOP

const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];

for (const [index, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`Movement ${index + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement ${index + 1} You withdrew ${Math.abs(mov)}`);
  }
}

console.log(`---FOR EACH----`);
movements.forEach(function (mov, index, arr) {
  if (mov > 0) {
    console.log(`Movement ${index + 1} You deposited ${mov}2`);
  } else {
    console.log(`Movement ${index + 1} You withdrew ${Math.abs(mov)}`);
  }
});


// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (curEl, key, map) {
  console.log(`${key}: ${curEl}`);
});

// Set
const currenciesUniq = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

currenciesUniq.forEach(function (value) {
  console.log(`${value}: ${value}`);S
});

// CHALLENGE 1
// NOT PUPPY >3 , IS PUPPY<3

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKatie = [10, 5, 6, 1, 4];

const checkDogs = function (arr1, arr2) {
  const Julia = arr1.splice(1, 2);
  const Katie = arr2.splice(0);

  const dogs = Julia.concat(Katie);
  console.log(dogs);

  dogs.forEach(function (currentDogAge, i) {
    const isPuppy =
      currentDogAge > 3
        ? `Dog number ${i + 1} is an adult`
        : `Dog number ${i + 1} is a puppy 🐶`;
    console.log(isPuppy);
  });
};
checkDogs(dogsJulia, dogsKatie);


const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];

const eurToUsd = 1.1;

const res = movements.map(function (mov) {
  return mov * eurToUsd;
});
console.log(movements, res);

// With for-of
// We manuallu create the new arr(res2)
const res2 = [];
for (const mov of movements) {
  res2.push(mov * eurToUsd);
}
console.log(res2);

// Using maps w/ arrow functions
const res3 = movements.map(mov => mov * eurToUsd);
console.log(res3);

const movDescript = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movDescript);

// Filter method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (currMov) {
  return currMov > 0;
});
console.log(movements);
console.log(deposits);

// for-of
const depos = [];
for (const curr of movements) {
  if (curr > 0) depos.push(curr);
}
console.log(depos);

const withdrawals = movements.filter(currEl => currEl < 0);
console.log(withdrawals);

// for-of
const withd = [];
for (const curre of movements) {
  if (curre < 0) withd.push(curre);
}
console.log(withd);


// -----REDUCE METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balance = movements.reduce(function (acc, currEl, i, arr) {
//   console.log(`Interation n${i}: ${acc}`);
//   return acc + currEl;
// }, 0);
const balance = movements.reduce((acc, currEl, i, arr) => acc + currEl, 0);
console.log(balance);

// USING FOR LOOP
console.log(`-------FOR LOOP-------`);
let sum = 0;
for (let i = 0; i < movements.length; i++) {
  sum += movements[i];
}
console.log(sum);

// USING FOR--OF LOOP
console.log(`------FOR OF-------`);

let sumOf = 0;
for (const curMovement of movements) {
  sumOf += curMovement;
}
console.log(sumOf);

//Get maximum value of one array
console.log(`----REDUCE-----`);
// maxVal is my accumulator
// const maximumValue = movements.reduce(function (maxVal, currEl) {
//   if (currEl > maxVal) maxVal = currEl;
//   return maxVal;
// }); into arrow function↓ ↓ ↓ ↓ ↓
const maximumValue = movements.reduce(
  (maxVal, currEl) => (currEl > maxVal ? (maxVal = currEl) : (maxVal = maxVal)),
  movements[0]
);
console.log(maximumValue);

// course way
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(`Course solution: ${max}`);

console.log(`----FOR OF----`);
let maximum = 0;
for (const currMovement2 of movements) {
  if (currMovement2 > maximum) maximum = currMovement2;
}
console.log(maximum);

// CHALLENGE #02

// TEST DATA 1 : [5,2,4,1,15,8,3]
// TEST DATA 2 : [16,6,10,5,6,1,4]

// const createUsernames = function (accountsArr) {
//   accountsArr.forEach(function (currentAcc) {
//     currentAcc.username = currentAcc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(curNam => curNam[0])
//       .join('');
//   });
// };
const calcAverageHumanAge = function (ages) {
  const dogInHuman = ages.map(dogAge =>
    dogAge <= 2 ? dogAge * 2 : 4 * dogAge + 16
  );
  const adults = dogInHuman.filter(dogAbov => dogAbov >= 18);
  console.log(`Dogs above 18: ` + adults);

  const avg = adults.reduce(function (acc, el, arr) {
    acc += el / adults.length;
    // acc += el / arr.length;

    return acc;
  }, 0);
  console.log(`The average is: ${avg}`);
  console.log(dogInHuman);

  // exclude dogs under 18 human years old
  // calc average human age of all adult dogs
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

const totalDeposInUSD = movements
  .filter(curDepos => curDepos > 0)
  .map(curDepos => curDepos * 1.1)
  .reduce((acc, curDepos) => acc + curDepos, 0);

console.log(totalDeposInUSD);

// CHALLENGE #04

const calcAverageHumanAge = function (ages) {
  const dogInHuman = ages
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 4 * dogAge + 16))
    .filter((dogAbov, i, arr) => {
      return dogAbov >= 18;
    })
    .reduce((acc, el) => acc + el / ages.length, 0);
  // console.log(dogInHuman);[36, 4, 32, 2, 76, 48, 28]
  console.log(dogInHuman);
  // const avg = adults.reduce((acc, el) => (acc += el / adults.length), 0);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const calcAverageHumanAge = ages => {
  const dogInHuman = ages.map(dogAge =>
    dogAge <= 2 ? dogAge * 2 : 4 * dogAge + 16
  );
  const adults = dogInHuman.filter(dogAbov => dogAbov >= 18);
  console.log(`We got ${adults.length} dogs above 18: ${adults}`);

  const avg = adults.reduce(function (acc, el, arr) {
    acc += el / adults.length;

    return acc;
  }, 0);
  console.log(`The average is: ${avg}`);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// rewrite
console.log(`----------CHALLENGE REWRITE----------`);
const calcAverageHumanAge2 = ages => {
  const dogInHuman = ages
    .map(curAge => (curAge <= 2 ? curAge * 2 : 4 * curAge + 16))
    .filter((dogAbov, i, arr) => {
      return dogAbov >= 18;
    })
    .reduce((acc, curAge, i, arr) => {
      return (acc += curAge / arr.length);
    }, 0);
  return `The average age is: ${dogInHuman}`;
};
console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(firstWithdrawal);

console.log(accounts);
// finding a property
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const laswithDrawal = movements.findLast(mov => mov < 0);
console.log(laswithDrawal);

const lastestlargestMov = movements.findLast((mov, i, arr) => {
  return Math.abs(mov) > 2000;
});

const lastestlargestMovIndex = movements.findLastIndex(
  mov => Math.abs(mov) > 2000
);

console.log(lastestlargestMov);
console.log(
  `Your latest large movement was : ${lastestlargestMov} (${
    movements.length - lastestlargestMovIndex
  })movements ago.`
);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// INCLUDES check for equality
console.log(movements.includes(-130));

// SOME check if there is any value that obeys the specified condition
const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit);

// EVERY
console.log(account4.movements.every(mov => mov > 0));

// Separated callbaack
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


// FLAT
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const overAllBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

// FLATMAP
const overAllBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);
*/
const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 37,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
