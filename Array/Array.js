'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Elijah Fagbohun',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 0.1, // %
  pin: 1111,
};

const account2 = {
  owner: 'Awonuga Olawale',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0.12,
  pin: 2222,
};

const account3 = {
  owner: 'Aworele David Olufemi',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.13,
  pin: 3333,
};

const account4 = {
  owner: 'Solomon Fagbohun',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 0.1,
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

 //Display Movements
const displayMovements = function(movements, sort = false) {
      containerMovements.innerHTML = ''

      const movs = sort ? movements.slice().sort((a, b)=> a-b)
      : movements;

   movs.forEach((mov, i)=> {
     const type = mov >0 ? 'deposit': 'withdrawal'
     const html = `
     <div class="movements__row">
     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
     <div class="movements__date"></div>
     <div class="movements__value">${mov}</div>
     </div>
     `

    containerMovements.insertAdjacentHTML('afterbegin', html)
   })
 }

 //Create new user
 const createNewUser = (accs)=>{
    accs.forEach((acc)=>{
     acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map((name)=>{
    return name[0] 
   }).join('')
})
 }
createNewUser(accounts) 

const updateUI = (acc)=>{
      //Display movements
      displayMovements(acc.movements)
      //Display Balance
      calDisplayBalance(acc)
      //Display Summary
      calDisplaySum(acc)
}

//calculate Print Balance
const calDisplayBalance = (acc)=>{
   acc.balance = acc.movements.reduce((acc, mov)=>{
    return acc + mov
  }, 0)
  
const date = new Date()
  labelBalance.textContent = `${acc.balance} NGN`
  labelDate.textContent = `${date}`
} 

//Calculate Total Income and Expenditure
const calDisplaySum = (acc)=>{
  const incomes = acc.movements.filter((mov)=>{
    return mov > 0
  })
  .reduce((acc, mov)=>{
    return mov + acc
  }, 0)
  labelSumIn.textContent = `${incomes}NGN`

  const expenditures = acc.movements.filter((mov)=>{
    return mov < 0
  })
  .reduce((acc, mov)=>{
     return mov + acc 
  })
   labelSumOut.textContent = `${Math.abs(expenditures)}NGN`
   

  const interest = acc.movements.filter((mov)=>{
    return mov > 0
  })
  .map((mov)=>{
    return (mov * acc.interestRate)
  })
  .reduce((acc, mov)=>{
    return mov + acc
  })
  labelSumInterest.textContent = `${interest}NGN`
}

//Event Handler
// Login
let currentAccount;
btnLogin.addEventListener('click', (e)=>{
  //prevent form from submitting
  e.preventDefault()

  currentAccount = accounts.find((acc)=>{
    return acc.username === inputLoginUsername.value
  })
  
  if(currentAccount.pin === Number(inputLoginPin.value)){
     //Display UI and Message
   labelWelcome.textContent = `Welcome back, ${currentAccount
   .owner.split(' ')[0]}`
   containerApp.style.opacity = 100;
     //Clear input fields
     inputLoginUsername.value = inputLoginPin.value = ''
     inputLoginPin.blur()
    
     //update UI
     updateUI(currentAccount)
  }
})

// Transferring funds
btnTransfer.addEventListener('click', (e)=>{
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find((acc)=>{
    return acc.username === inputTransferTo.value
  })

  if(
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ){
    // Doing the transfeer
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

     //update UI
     updateUI(currentAccount)
     inputTransferAmount.value = inputTransferTo.value = ''
     inputTransferAmount.blur()
     inputTransferTo.blur()
  }
})

// Requesting Loan
btnLoan.addEventListener('click', (e)=>{
  e.preventDefault()

  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAccount.movements.some((mov)=>{
    return mov >= amount * 0.1
  })){
    // Add movement
    currentAccount.movements.push(amount)

    // Update UI
    updateUI(currentAccount)
  }
inputLoanAmount.value = ''
})

// Closing the account
btnClose.addEventListener('click', (e)=>{
  e.preventDefault()

  if(
    inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin
  ){
    const index = accounts.findIndex(
      (acc) =>{
        return acc.username === currentAccount.username
      } 
    )

    // Delete account
    accounts.splice(index, 1)

    // Hide UI
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;
btnSort.addEventListener('click', (e)=>{
  e.preventDefault()

  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})
// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements =  [200, -200, 340, -300, -20, 50, 400, -460]

// sorts. numbers

// return < 0, A, B (kepp order)
// return > 0, B, A (switch order)

// Ascending 
movements.sort((a, b)=> a-b);
console.log(movements)

// Descending
movements.sort((a, b)=> b-a);
console.log(movements)