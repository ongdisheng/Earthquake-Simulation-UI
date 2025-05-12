import type { ProColumns } from "@ant-design/pro-components";
import { EditableProTable } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import earthquakeService from "../services/earthquake";
import dayjs from "dayjs";
import { notify } from "../utils/notificationHelper";
import { AlertDataType } from "../types/alert";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export interface AlertsPanelHandle {
  handleAutoClose: (id: string) => void;
}

const AlertsPanel = forwardRef<AlertsPanelHandle>((_, ref) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly AlertDataType[]>([]);

  useImperativeHandle(ref, () => ({
    handleAutoClose: (id: string) => {
      setDataSource((prev) => prev.filter((alert) => alert.id !== id));
      notify("info", `Alert ${id} has been auto-closed.`);
    },
  }));

  const columns: ProColumns<AlertDataType>[] = [
    {
      title: "Source",
      dataIndex: "source",
      readonly: true,
      width: "15%",
    },
    {
      title: "Location",
      dataIndex: "location",
      readonly: true,
      width: "15%",
    },
    {
      title: "Severity Level",
      key: "severityLevel",
      dataIndex: "severityLevel",
      readonly: true,
      valueEnum: {
        1: {
          text: "L1",
          color: "orange",
        },
        2: {
          text: "L2",
          color: "red",
        },
      },
    },
    {
      title: "Origin Time",
      dataIndex: "originTime",
      readonly: true,
    },
    {
      title: "Has Damage",
      key: "hasDamage",
      dataIndex: "hasDamage",
      valueType: "select",
      valueEnum: {
        "0": {
          text: "No",
          status: "Success",
        },
        "1": {
          text: "Yes",
          status: "Error",
        },
      },
    },
    {
      title: "Needs Command Center",
      key: "needsCommandCenter",
      dataIndex: "needsCommandCenter",
      valueType: "select",
      valueEnum: {
        "0": {
          text: "No",
          status: "Success",
        },
        "1": {
          text: "Yes",
          status: "Error",
        },
      },
    },
    {
      title: "Operations",
      valueType: "option",
      width: 150,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </a>,
        <a
          key="submit"
          onClick={() => {
            if (record.hasDamage === "" || record.needsCommandCenter === "") {
              notify(
                "error",
                "Please update both hasDamage and needsCommandCenter before submit",
              );
            } else {
              const updatedAlert = {
                ...record,
                status: "PROCESSED",
                processedTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              };

              earthquakeService
                .updateAlert(record.id, updatedAlert)
                .then(() => {
                  setDataSource(
                    dataSource.filter((item) => item.id !== record.id),
                  );
                  notify("success", `You have responded to alert ${record.id}`);
                })
                .catch((error) => {
                  notify("error", error.message);
                });
            }
          }}
        >
          Submit
        </a>,
      ],
    },
  ];

  return (
    <>
      <ConfigProvider locale={enUS}>
        <EditableProTable<AlertDataType>
          rowKey="id"
          headerTitle=" "
          maxLength={3}
          recordCreatorProps={false}
          scroll={{
            x: 960,
          }}
          loading={false}
          columns={columns}
          request={async () => {
            try {
              const response = await earthquakeService.getAlerts();
              const data = response.data.data;
              const parsedData = data.map((item: AlertDataType) => ({
                ...item,
                originTime: dayjs(item.originTime).format(
                  "YYYY-MM-DD HH:mm:ss",
                ),
                hasDamage:
                  String(item.hasDamage) === "-1" ? "" : String(item.hasDamage),
                needsCommandCenter:
                  String(item.needsCommandCenter) === "-1"
                    ? ""
                    : String(item.needsCommandCenter),
              }));
              return {
                data: parsedData,
                total: parsedData.total,
                success: true,
              };
            } catch (error) {
              console.log(error);
              return {
                data: [],
                total: 0,
                success: false,
              };
            }
          }}
          value={dataSource}
          onChange={setDataSource}
          editable={{
            type: "multiple",
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
              await waitTime(100);
            },
            onChange: setEditableRowKeys,
            actionRender: (row, config, dom) => [dom.save, dom.cancel],
          }}
        />
      </ConfigProvider>
    </>
  );
});

export default AlertsPanel;
