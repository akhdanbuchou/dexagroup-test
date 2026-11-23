"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { startTransition, useActionState } from "react";
import { login } from "@/actions/auth";
import type { TLoginInput } from "@/types/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  const onFinish = (values: TLoginInput) => {
    startTransition(() => formAction(values));
  };

  return (
    <Form<TLoginInput>
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
      disabled={pending}
    >
      {state.error && (
        <Alert
          type="error"
          title={state.error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter your username" }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          autoComplete="username"
          autoFocus
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={pending}>
        Sign in
      </Button>
    </Form>
  );
}
