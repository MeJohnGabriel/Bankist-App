'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2025-08-03T14:43:26.374Z',
    '2025-08-05T18:49:59.371Z',
    '2025-08-06T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2025-08-26T14:43:26.374Z',
    '2025-08-28T18:49:59.371Z',
    '2025-08-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const dateFormated = function (currentDate, locale) {
  const calcDaysPast = (date1, date2) =>
    Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPast(new Date(), currentDate);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 0) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${currentDate.getDate()}`.padStart(2, 0);
  // const moth = `${currentDate.getMonth() + 1}`.padStart(2, 0);
  // const year = currentDate.getFullYear();
  // return `${day}/${moth}/${year}`;
  return new Intl.DateTimeFormat(locale).format(currentDate);
};

const displayMovements = function (account, isSorted = false) {
  containerMovements.innerHTML = '';

  const combinedMovsAndDates = account.movements.map((mov, i) => {
    return { movement: mov, movementDate: account.movementsDates.at(i) };
  });

  if (isSorted) combinedMovsAndDates.sort((a, b) => a.movement - b.movement);
  // const movementsSorted = isSorted
  //   ? account.movements.slice().sort((a, b) => a - b)
  //   : account.movements;

  combinedMovsAndDates.forEach(function (objectMov, i) {
    const { movement, movementDate } = objectMov;
    const operationType = movement > 0 ? 'deposit' : 'withdrawal';

    // const currentDate = new Date(account.movementsDates[i]);
    const currentDate = new Date(movementDate);
    const displayDate = dateFormated(currentDate, account.locale);

    const formatedMovement = formatCur(
      movement,
      account.locale,
      account.currency
    );
    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${operationType}">${
      i + 1
    } ${operationType}</div> <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMovement}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  console.log(combinedMovsAndDates);
};

// IMPLEMENTING SORT
let sortedState = false;

btnSort.addEventListener('click', function (e) {
  sortedState = !sortedState;
  e.preventDefault();
  displayMovements(currentAccount, sortedState);
});

//
const calcDisplayBalance = function (account) {
  // making total of money dynamically
  account.balance = account.movements.reduce(
    (acc, currentMovement) => acc + currentMovement
  );
  const formatedMovement = formatCur(
    account.balance,
    account.locale,
    account.currency
  );

  labelBalance.textContent = `${formatedMovement}`;
};
// // Other to calc interesRate
// const inteRT = (incomes * 1.2) / 100;
// console.log(`One way : ${inteRT}`);
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((account, curMov) => account + curMov, 0);
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((account, curMov) => account + curMov, 0);

  const interestRate = account.movements
    .filter(curMov => curMov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((interest, i, arr) => {
      return interest >= 1;
    })
    .reduce((account, curInterest) => account + curInterest, 0);

  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCur(
    interestRate,
    account.locale,
    account.currency
  );
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
  displayMovements(account);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
};

// Timeout function - (log-of)
const startTimeOut = function () {
  const tick = function () {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log user out
    if (timer === 0) {
      clearInterval(time);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //  Decrease 1s
    timer--;
  };

  // Set time to 5 min
  let timer = 120;

  // Call timer every second
  tick();
  const time = setInterval(tick, 1000);
  // we need the timer variable to work with it on the login function
  return time;
};

let currentAccount, time;
// Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

// Experimenting with API(search for language codes: ISO LANGUAGE TABLE)
// const currentDate = new Date();
// // labelDate.textContent = new Intl.DateTimeFormat('pt-BR').format(currentDate);
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };

// const locale = navigator.language;
// console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
//   currentDate
// );

// Implementing curerrent dates: dd/mm/yyyy
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // const currentDate = new Date();
    // const day = `${currentDate.getDate()}`.padStart(2, 0);
    // const moth = `${currentDate.getMonth() + 1}`.padStart(2, 0);
    // const year = currentDate.getFullYear();
    // const hour = `${currentDate.getHours()}`.padStart(2, 0);
    // const min = `${currentDate.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${moth}/${year}, ${hour}:${min}`;
    const currentDate = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(currentDate);

    // Emptying input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (time) clearInterval(time);
    time = startTimeOut();
    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSACTIONS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
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

    // Add tranfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }

  // Reset timer
  clearInterval(time);
  time = startTimeOut();

  // Clearing out inputs
  inputTransferAmount.value = inputTransferTo.value = '';
});

// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const incomes = currentAccount.movements.filter(mov => mov > 0);
  const LoanAmount = Math.floor(inputLoanAmount.value);

  const loanIsAllowed = incomes.some(
    anyDepo => anyDepo >= (LoanAmount * 10) / 100
  );
  // HOW JONAS DID IT : if (amount > 0 && currentAccount.movements.some(mov mov >= amount * 0.1))
  if (LoanAmount > 0 && loanIsAllowed === true) {
    setTimeout(function () {
      currentAccount.movements.push(LoanAmount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';

  // Reset timer
  clearInterval(time);
  time = startTimeOut();
});

// DELETE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // check credentials
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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
