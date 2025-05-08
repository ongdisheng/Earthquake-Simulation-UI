import React, { useState, useEffect } from "react";
import { Typography, Button, Form, InputNumber } from "antd";
import {
  getAlertSuppressTime,
  updateAlertSuppressTime,
} from "../services/settings";
import { notify } from "../utils/notificationHelper";

const { Text } = Typography;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const inputFieldStyle = { width: "80%" };

const SettingsForm = () => {
  const [form] = Form.useForm();
  const [suppressTime, setSuppressTime] = useState(null);

  useEffect(() => {
    getAlertSuppressTime().then((res) => {
      setSuppressTime(res.data.data);
    });
  }, []);

  // update alert suppress time
  const onFinish = (values) => {
    updateAlertSuppressTime(values).then((res) => {
      setSuppressTime(res.data.data);
      notify("success", res.data.message);
      form.resetFields();
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        <Text type="secondary">Current Alert Suppress Time: </Text>
        <Text type="success">{`${suppressTime} sec`}</Text>
      </div>

      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        style={{ marginTop: 24, maxWidth: 600 }}
      >
        <Form.Item
          label="New Alert Suppress Time"
          name="alertSuppressTime"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={1}
            style={inputFieldStyle}
            stringMode
            addonAfter="sec"
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SettingsForm;
