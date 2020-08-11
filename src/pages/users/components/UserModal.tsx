import React, { useEffect, FC } from "react";
import moment from "moment";
import { Modal, Button, Form, Input, DatePicker, Switch } from "antd";
import { SingleUserType, FormValues } from "../data.d";

interface UserModalProps {
  modalVisible: boolean;
  record: SingleUserType | null;
  handleCancel: () => void;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean;
}

const UserModal: FC<UserModalProps> = (props) => {
  let [form] = Form.useForm();
  let { record, modalVisible, handleCancel, onFinish, confirmLoading } = props;
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        create_time: moment(record.create_time),
        status: Boolean(record.status),
      });
    } else {
      form.resetFields();
    }
  }, [modalVisible]);
  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={record ? "编辑" + record.id : "添加"}
      visible={modalVisible}
      onOk={onOk}
      onCancel={handleCancel}
      forceRender
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          status: true,
        }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="创建时间" name="create_time">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="状态" name="status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
