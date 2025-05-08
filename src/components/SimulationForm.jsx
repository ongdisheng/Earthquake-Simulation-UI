import React from "react";
import { Button, Form, InputNumber, Select, Space, Input } from "antd";
import dayjs from "dayjs";
import earthquakeService from "../services/earthquake";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { notify } from "../utils/notificationHelper";

const COUNTY = ["Taipei", "Hsinchu", "Taichung", "Tainan"];
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const inputFieldStyle = { width: "80%" };

const SimulationForm = () => {
  const [form] = Form.useForm();
  const shakingArea = Form.useWatch("shakingArea", form) || [];

  // simulate an earthquake incident
  const onFinish = (values) => {
    // include current time and source
    const originTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const source = "Simulation";

    const earthquakeObj = {
      ...values,
      originTime,
      source,
    };

    earthquakeService
      .create(earthquakeObj)
      .then((res) => {
        console.log(res);
        notify("success", res.data.message);
        onReset();
      })
      .catch((error) => {
        notify("error", error.message);
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="epicenterLocation"
          label="Epicenter Location"
          rules={[{ required: true }]}
        >
          <Input style={inputFieldStyle} />
        </Form.Item>

        <Form.Item
          name="magnitudeValue"
          label="Magnitude Value"
          rules={[{ required: true }]}
        >
          <InputNumber
            min="0"
            max="10"
            step="0.1"
            stringMode
            style={inputFieldStyle}
          />
        </Form.Item>

        <Form.Item
          name="focalDepth"
          label="Focal Depth"
          rules={[{ required: true }]}
        >
          <InputNumber
            min="0"
            max="1000"
            step="0.1"
            stringMode
            style={inputFieldStyle}
            addonAfter="km"
          />
        </Form.Item>

        <Form.Item label="Shaking Area">
          <Form.List name="shakingArea">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  // avoid duplicated county selections
                  const currentCounty = shakingArea?.[name]?.countyName;
                  const selectedCounties = shakingArea
                    .map((item, index) => index !== name && item?.countyName)
                    .filter(Boolean);

                  const availableCounties = COUNTY.filter(
                    (county) =>
                      !selectedCounties.includes(county) ||
                      county === currentCounty,
                  );

                  return (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "countyName"]}
                        rules={[{ required: true }]}
                      >
                        <Select
                          placeholder="Select a county"
                          allowClear
                          style={{ width: "14em" }}
                          options={availableCounties.map((county) => ({
                            value: county,
                            label: county,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "areaIntensity"]}
                        rules={[{ required: true }]}
                      >
                        <InputNumber min="0" max="10" step="0.1" stringMode />
                      </Form.Item>
                      <MinusCircleOutlined
                        data-testid={`remove-icon-${name}`}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ width: "80%" }}
                  >
                    Add
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default SimulationForm;
