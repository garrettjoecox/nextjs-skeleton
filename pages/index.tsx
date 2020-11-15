import { Layout, Menu, Row } from 'antd';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import isAuth from '../backend/middleware/isAuth';
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from '../backend/types/NextApi';
import useAsync from '../frontend/hooks/useAsync';

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  try {
    const req = context.req as ExtendedNextApiRequest;
    const res = context.res as ExtendedNextApiResponse;
    req.context = {
      requestId: uuid(),
    };
    await isAuth(req, res);

    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};

export default function Index() {
  const router = useRouter();
  const { execute: executeLogout } = useAsync<void>(async () => {
    await axios.delete('/api/auth');

    router.push('/auth/login');
  }, false);

  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: '#FFF' }}>
        <div className="logo" />
        <Row justify="space-between">
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Your Plan</Menu.Item>
            <Menu.Item key="2">Your Campaigns</Menu.Item>
            <Menu.Item key="3">Insights</Menu.Item>
          </Menu>
          <Menu theme="light" mode="horizontal">
            <Menu.Item onClick={executeLogout}>Logout</Menu.Item>
          </Menu>
        </Row>
      </Layout.Header>
      <Layout.Content style={{ padding: '0 50px', marginTop: 64 }}>Content</Layout.Content>
    </Layout>
  );
}
