import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Form, Input, Row } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useAsync from '../../frontend/hooks/useAsync';
import styles from '../../frontend/styles/landing.module.css';

export default function Login() {
  const router = useRouter();
  const [form] = Form.useForm();

  const { execute: executeLogin, status: loginStatus, error: loginError } = useAsync<void>(async () => {
    const { email, password } = form.getFieldsValue();

    await axios.post('/api/auth', { email, password });

    router.push('/');
  }, false);

  return (
    <Row className={styles.landingContainer} justify="center" align="middle">
      <Card title="Welcome Back!" className={styles.landingCard}>
        <Form form={form} className="login-form" initialValues={{ remember: true }} onFinish={executeLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link href="/auth/forgot-password">
                <a href="/auth/forgot-password">Forgot password</a>
              </Link>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button block size="large" type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
          <Form.Item>
            Or{' '}
            <Link href="/auth/signup">
              <a href="/auth/signup">register now!</a>
            </Link>
          </Form.Item>
          {loginStatus === 'error' && (
            <Alert
              className={styles.alert}
              message="Error"
              description={
                (loginError as any)?.response?.data?.message || loginError?.message || 'Something went wrong'
              }
              type="error"
              showIcon
            />
          )}
        </Form>
      </Card>
    </Row>
  );
}
