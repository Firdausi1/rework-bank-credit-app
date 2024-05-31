const loginForm = document.getElementById("loginContainer");
const registerForm = document.getElementById("register");
let banner = document.getElementById("banner");
let message = document.getElementById("message");
let repaymentPeriod = "";
let submit = true;
const creditHist = [
  "1 month",
  "2 months",
  "3 months",
  "4 months",
  "5 months",
  "6 months",
  "7 months",
  "8 months",
  "9 months",
  "10 months",
  "11 months",
  "1 year",
];

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const error = {
    errorName: document.getElementById("errorName"),
    errorAmount: document.getElementById("errorAmount"),
    errorCredit: document.getElementById("errorCredit"),
    errorDeposit: document.getElementById("errorDeposit"),
    errorCollection: document.getElementById("errorCollection"),
    errorRepayment: document.getElementById("errorRepayment"),
    errorExpected: document.getElementById("errorExpected"),
  };

  const userDetails = {
    username: document.getElementById("userName").value.trim().toLowerCase(),
    amount: parseInt(document.getElementById("amount").value),
    creditHistory: document
      .getElementById("creditHistory")
      .value.trim()
      .toLowerCase(),
    lastDeposit: document
      .getElementById("lastDeposit")
      .value.trim()
      .toLowerCase(),
    lastCollection: document
      .getElementById("lastCollection")
      .value.trim()
      .toLowerCase(),
    accountType: document
      .getElementById("accountType")
      .value.trim()
      .toLowerCase(),
    expectedPeriod: document
      .getElementById("expectedPeriod")
      .value.trim()
      .toLowerCase(),
    repaymentPeriod: document
      .getElementById("repayment")
      .value.trim()
      .toLowerCase(),
  };

  // userDetails.repayments.forEach((item) => {
  //   if (item.checked) {
  //     repaymentPeriod = item.value.trim().toLowerCase();
  //   }
  // });

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const checkUsername = users.find(
    (item) => item.username === userDetails.username
  );
  validateFields(error, userDetails, checkUsername);

  if (submit) {
    let creditScore = 0;
    const newUser = {
      username: userDetails.username,
      amount: userDetails.amount,
      creditHistory: userDetails.creditHistory,
      lastDeposit: userDetails.lastDeposit,
      lastCollection: userDetails.lastCollection,
      accountType: userDetails.accountType,
      expectedPeriod: userDetails.expectedPeriod,
      repaymentPeriod: userDetails.repaymentPeriod,
      creditScore,
      transactionHistory: [],
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    location.href = "loan.html";
  }
});

document.getElementById("login").addEventListener("click", (e) => {
  e.preventDefault();
  const username = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((item) => item.username === username);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    banner.style.display = "block";
    banner.setAttribute("class", "successMessage");
    message.innerHTML = "Login Successful";
    setTimeout(() => {
      window.location.href = "loan.html";
    }, 2000);
  } else {
    banner.style.display = "block";
    banner.setAttribute("class", "errorMessage");
    message.innerHTML = "Invalid Username";
    setTimeout(() => {
      banner.style.display = "none";
    }, 5000);
  }
});

function validateFields(error, user, checkUsername) {
  user.username === "" || null
    ? ((error.errorName.style.display = "inline-block"), (submit = false))
    : checkUsername
    ? ((error.errorName.innerHTML = "Username already exists"),
      (submit = false),
      (error.errorName.style.display = "inline-block"))
    : ((error.errorName.style.display = "none"), (submit = true));
  isNaN(user.amount) || null
    ? ((error.errorAmount.style.display = "inline-block"), (submit = false))
    : ((error.errorAmount.style.display = "none"), (submit = true));
  user.creditHistory === "" || null
    ? ((error.errorCredit.style.display = "inline-block"), (submit = false))
    : ((error.errorCredit.style.display = "none"), (submit = true));
  user.lastDeposit === "" || null
    ? ((error.errorDeposit.style.display = "inline-block"), (submit = false))
    : ((error.errorDeposit.style.display = "none"), (submit = true));
  user.lastCollection === "" || null
    ? ((error.errorCollection.style.display = "inline-block"), (submit = false))
    : ((error.errorCollection.style.display = "none"), (submit = true));
  user.expectedPeroid === "" || null
    ? ((error.errorExpected.style.display = "inline-block"), (submit = false))
    : ((error.errorExpected.style.display = "none"), (submit = true));
  user.repaymentPeriod === "" || null
    ? ((error.errorRepayment.style.display = "inline-block"), (submit = false))
    : ((error.errorRepayment.style.display = "none"), (submit = true));
}

document.getElementById("registerBtn").addEventListener("click", () => {
  banner.style.display = "none";
  document.getElementById("blue-bg").className = "slideLeft";
  document.getElementById("content2").style.display = "block";
  document.getElementById("content1").style.display = "none";
});

document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("blue-bg").className = "slideRight";
  document.getElementById("content2").style.display = "none";
  document.getElementById("content1").style.display = "block";
});

document.getElementById("registerBtnMobile").addEventListener("click", () => {
  banner.style.display = "none";
  loginForm.style.display = "none";
  registerForm.style.display = "flex";
});

document.getElementById("loginBtnMobile").addEventListener("click", () => {
  loginForm.style.display = "flex";
  registerForm.style.display = "none";
});

function displayCreditHistory() {
  let container = document.getElementById("creditHistory");
  let inner = creditHist
    .map((item, index) => {
      return `<option value=${index + 1}>${item}</option>`;
    })
    .join();
  container.innerHTML = inner;
}
function getTodaysDate() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  day = day > 10 ? day : `0${day}`;
  month = month > 10 ? month + 1 : `0${month + 1}`;
  const val = `${year}-${month}-${day}`;

  document.getElementById("expectedPeriod").setAttribute("min", val);
}

function getStartDate() {
  const val = document.getElementById("expectedPeriod").value;
  document.getElementById("repayment").setAttribute("min", val);
}

document.addEventListener("DOMContentLoaded", () => {
  displayCreditHistory();
  getTodaysDate();
});
