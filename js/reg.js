// 针对账号的验证规则
const loginIdValidator = new Validator('txtLoginId', async function (inputValue) {
  const value = inputValue.trim();
  if (value === '') {
    return '账号不能为空';
  }
  const resp = await API.exists(value);
  if (resp.data) {
    return '账号已存在，请更换';
  }
  if (value.length < 6) {
    return '账号长度不能少于6位';
  }
});

// 昵称的验证规则
const nicknameValidator = new Validator('txtNickname', function (inputValue) {
  const value = inputValue.trim();
  if (value === '') {
    return '昵称不能为空';
  }
  if (value.length < 2) {
    return '昵称长度不能少于2位';
  }
})

// 密码的验证规则
const passwordValidator = new Validator('txtLoginPwd', function (inputValue) {
  const value = inputValue.trim();
  if (value === '') {
    return '密码不能为空';
  }
  if (value.length < 6) {
    return '密码长度不能少于6位';
  }
})

// 确认密码的验证规则
const confirmPasswordValidator = new Validator('txtLoginPwdConfirm', function (inputValue) {
  const value = inputValue.trim();
  if (value === '') {
    return '确认密码不能为空';
  }
  if (value !== passwordValidator.input.value) {
    return '两次密码输入不一致';
  }
})

const validators = [
  loginIdValidator,
  nicknameValidator,
  passwordValidator,
  confirmPasswordValidator,
]

const form = document.querySelector('.user-form');
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const result = await Validator.validate(...validators);
  if (!result) {
    return;
  } 
  const formData = new FormData(this);
  const options = Object.fromEntries(formData.entries());
  const resp = await API.reg(options);
  console.log(resp);
  if (resp.code === 0) {
    alert('注册成功，请前往登录');
    form.reset();
    location.href = './login.html';
  }
})
