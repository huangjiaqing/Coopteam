import React, { PureComponent } from 'react';
import { Form, Input, Button, Icon, Checkbox, message } from 'antd';
import api from 'services/user';
import styles from './Login.css';

const FormItem = Form.Item;

@Form.create()
export default class Login extends PureComponent {

  onSummit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const { data } = await api.login(value);
        if (data.success) {
          window.localStorage._userId = data.user._userId;
          this.props.history.push('/org');
        } else {
          message.error(data.err);
        }
      }
    });
  }

  render() {

    return (
      <div className={styles.login}>
        <div className={styles.body}>
          <h2>COOPTEAM</h2>
          {this.renderForm()}
        </div>
      </div>
    );
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.onSummit} className={styles.loginForm}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱或手机号' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'gray' }} />}
              placeholder="邮箱/手机号"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'gray' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </FormItem>
        <FormItem>
          <div className={styles.loginBtn}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住我</Checkbox>
            )}
            <Button
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}