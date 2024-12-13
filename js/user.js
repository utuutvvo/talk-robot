// 用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 * @param {String} textId 文本框文本
 * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若返回null，则表示无错误
 */
class Validator {
  constructor(txtId, validatorFunc) {
    this.input = document.querySelector('#' + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    // 验证时间，失焦或提交时
    this.input.onblur = () => {
      this.validate();
    }
  }

  async validate() {
    const mes = await this.validatorFunc(this.input.value);
    if (mes) {
      this.p.innerText = mes;
      return false;
    }else {
      this.p.innerText = '';
      return true;
    }
  }

  static async validate(...Validators) {
    const proms = Validators.map(item => item.validate());
    const results = await Promise.all(proms);
    return results.every(item => item);
  }
}
