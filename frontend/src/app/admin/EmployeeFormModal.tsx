"use client";

import { Alert, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/employees";
import type { TEmployeeFormModalProps, TEmployeeFormValues } from "@/types/employee";
import { DATE_PARAM_FORMAT } from "@/utils/date";
import { errorMessage, toFieldErrors } from "@/utils/http";

const FORM_FIELDS = ["name", "dateOfBirth", "position", "username", "password"];

export function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSaved,
}: TEmployeeFormModalProps) {
  const [form] = Form.useForm<TEmployeeFormValues>();
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const saving = createMutation.isPending || updateMutation.isPending;
  const isCreate = mode === "create";

  useEffect(() => {
    if (!open) {
      return;
    }
    form.resetFields();
    if (employee && !isCreate) {
      form.setFieldsValue({
        name: employee.name,
        position: employee.position,
        dateOfBirth: dayjs(employee.dateOfBirth, DATE_PARAM_FORMAT),
      });
    }
  }, [open, employee, isCreate, form]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const onFinish = (values: TEmployeeFormValues) => {
    setError(null);
    const base = {
      name: values.name.trim(),
      position: values.position.trim(),
      dateOfBirth: values.dateOfBirth.format(DATE_PARAM_FORMAT),
    };

    const handleError = (mutationError: unknown) => {
      const fieldErrors = Object.entries(toFieldErrors(mutationError, FORM_FIELDS));
      if (fieldErrors.length > 0) {
        form.setFields(
          fieldErrors.map(([name, message]) => ({
            name: name as keyof TEmployeeFormValues,
            errors: [message],
          })),
        );
        return;
      }
      setError(errorMessage(mutationError));
    };

    if (isCreate) {
      createMutation.mutate(
        { ...base, username: values.username ?? "", password: values.password ?? "" },
        { onSuccess: onSaved, onError: handleError },
      );
      return;
    }
    if (employee) {
      updateMutation.mutate(
        { id: employee.id, input: base },
        { onSuccess: onSaved, onError: handleError },
      );
    }
  };

  return (
    <Modal
      open={open}
      title={isCreate ? "Add Employee" : "Edit Employee"}
      okText={isCreate ? "Add Employee" : "Save Changes"}
      onOk={() => form.submit()}
      onCancel={handleClose}
      confirmLoading={saving}
      destroyOnHidden
      mask={{ closable: !saving }}
      forceRender
    >
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
      <Form<TEmployeeFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        disabled={saving}
      >
        <Form.Item
          label="Full name"
          name="name"
          rules={[
            { required: true, whitespace: true, message: "Please enter the employee's name" },
            { max: 100 },
          ]}
        >
          <Input placeholder="e.g. Giorno Giovanna" />
        </Form.Item>
        <Form.Item
          label="Date of birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Please select a date of birth" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="D MMM YYYY"
            disabledDate={(date) => date.isAfter(dayjs(), "day")}
          />
        </Form.Item>
        <Form.Item
          label="Position"
          name="position"
          rules={[
            { required: true, whitespace: true, message: "Please enter a position" },
            { max: 100 },
          ]}
        >
          <Input placeholder="e.g. Software Engineer" />
        </Form.Item>
        {isCreate && (
          <>
            <Form.Item
              label="Username"
              name="username"
              extra="Used by the employee to sign in."
              normalize={(value: string) => value?.toLowerCase()}
              rules={[
                { required: true, message: "Please enter a username" },
                {
                  pattern: /^[a-z0-9._]{3,30}$/,
                  message: "3–30 lowercase letters, numbers, dots or underscores",
                },
              ]}
            >
              <Input placeholder="e.g. giorno" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Initial password"
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 8, message: "At least 8 characters" },
                { max: 72 },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
