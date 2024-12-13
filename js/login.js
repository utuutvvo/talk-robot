// 针对账号的验证规则
const loginIdValidator = new Validator('txtLoginId', function (inputValue) {
    const value = inputValue.trim();
    if (value === '') {
      return '账号不能为空';
    }
    if (value.length < 6) {
      return '账号长度不能少于6位';
    }
  });
  
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
  
  const validators = [
    loginIdValidator,
    passwordValidator,
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
    const resp = await API.login(options);
    console.log(resp);
    if (resp.code === 0) {
      alert('恭喜你，登陆成功');
      form.reset();
      location.href = './index.html';
    }
  })
  