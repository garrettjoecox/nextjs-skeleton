import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Row } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useAsync from '../../frontend/hooks/useAsync';
import styles from '../../frontend/styles/landing.module.css';

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Signup() {
  const router = useRouter();
  const [form] = Form.useForm();

  const { execute: executeSignup, status: signupStatus, error: signupError } = useAsync<void>(async () => {
    const { name, email, password } = form.getFieldsValue();

    await axios.post('/api/users', { name, email, password });
    await axios.post('/api/auth', { email, password });

    router.push('/');
  }, false);

  return (
    <Row className={styles.landingContainer} justify="center" align="middle">
      <Card title="Welcome!" className={styles.landingCard}>
        <Form form={form} className="login-form" initialValues={{ remember: true }} onFinish={executeSignup}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { pattern: emailRegex, message: 'Please enter a valid email!' },
            ]}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your Password!' },
              {
                min: 8,
                message: 'Password must be at least 8 characters!',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button block size="large" type="primary" htmlType="submit" loading={signupStatus === 'pending'}>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item>
            Or{' '}
            <Link href="/auth/login">
              <a href="/auth/login">log in!</a>
            </Link>
          </Form.Item>
          {signupStatus === 'error' && (
            <Alert
              className={styles.alert}
              message="Error"
              description={
                (signupError as any)?.response?.data?.message || signupError?.message || 'Something went wrong'
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
